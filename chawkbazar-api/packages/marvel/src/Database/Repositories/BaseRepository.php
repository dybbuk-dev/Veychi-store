<?php


namespace Marvel\Database\Repositories;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use League\Csv\CannotInsertRecord;
use Marvel\Database\Models\Shop;
use Marvel\Enums\Permission;
use Marvel\Exceptions\MarvelException;
use Prettus\Repository\Contracts\CacheableInterface;
use Prettus\Repository\Traits\CacheableRepository;
use Prettus\Repository\Eloquent\BaseRepository as Repository;
use Illuminate\Database\Eloquent\Collection;
use League\Csv\Writer;
use Illuminate\Support\Facades\Schema;
use SplTempFileObject;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;


abstract class BaseRepository extends Repository implements CacheableInterface
{
    use CacheableRepository;

    /**
     * Find data by field and value
     *
     * @param string $field
     * @param string $value
     * @param array $columns
     * @return mixed
     */
    public function findOneByField($field, $value = null, $columns = ['*'])
    {
        $model = $this->findByField($field, $value, $columns = ['*']);

        return $model->first();
    }

    /**
     * @param $field
     * @param null $value
     * @param string[] $columns
     * @return JsonResponse
     */
    public function findOneByFieldOrFail($field, $value = null, $columns = ['*'])
    {
        $model = $this->findByField($field, $value, $columns = ['*']);
        if (!$model->first()) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.NOT_FOUND');
        }
        return $model->first();
    }


    /**
     * Find data by field and value
     *
     * @param string $field
     * @param string $value
     * @param array $columns
     * @return mixed
     */
    public function findOneWhere(array $where, $columns = ['*'])
    {
        $model = $this->findWhere($where, $columns);

        return $model->first();
    }

    /**
     * Find data by id
     *
     * @param int $id
     * @param array $columns
     * @return mixed
     */
    public function find($id, $columns = ['*'])
    {
        $this->applyCriteria();
        $this->applyScope();
        $model = $this->model->find($id, $columns);
        $this->resetModel();

        return $this->parserResult($model);
    }

    /**
     * Find data by id
     *
     * @param int $id
     * @param array $columns
     * @return mixed
     */
    public function findOrFail($id, $columns = ['*'])
    {
        $this->applyCriteria();
        $this->applyScope();
        $model = $this->model->findOrFail($id, $columns);
        $this->resetModel();

        return $this->parserResult($model);
    }

    /**
     * Count results of repository
     *
     * @param array $where
     * @param string $columns
     * @return int
     */
    public function count(array $where = [], $columns = '*')
    {
        $this->applyCriteria();
        $this->applyScope();

        if ($where) {
            $this->applyConditions($where);
        }

        $result = $this->model->count($columns);
        $this->resetModel();
        $this->resetScope();

        return $result;
    }

    /**
     * @param string $columns
     * @return mixed
     */
    public function sum($columns)
    {
        $this->applyCriteria();
        $this->applyScope();

        $sum = $this->model->sum($columns);
        $this->resetModel();

        return $sum;
    }

    /**
     * @param string $columns
     * @return mixed
     */
    public function avg($columns)
    {
        $this->applyCriteria();
        $this->applyScope();

        $avg = $this->model->avg($columns);
        $this->resetModel();

        return $avg;
    }

    /**
     * @return mixed
     */
    public function getModel()
    {
        return $this->model;
    }
    public function base64ImageResolver($image_64,$imageName): string
    {
        $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];   // .jpg .png .pdf
        $replace = substr($image_64, 0, strpos($image_64, ',')+1);
        $image = str_replace($replace, '', $image_64);
        $image = str_replace(' ', '+', $image);
        $imageName = $imageName.'.'.$extension;
        Storage::disk('public')->put($imageName, base64_decode($image));
        return  Storage::url($imageName);
    }
    public function hasPermission($user, $shop_id)
    {
        try {
            $shop = Shop::findOrFail($shop_id);
        } catch (Exception $e) {
            return false;
        }
        if (!$shop->is_active) {
            throw new MarvelException(config('shop.app_notice_domain') . 'ERROR.SHOP_NOT_APPROVED');
        }
        if ($user && $user->hasPermissionTo(Permission::SUPER_ADMIN)) {
            return true;
        } elseif ($user &&  $user->hasPermissionTo(Permission::STORE_OWNER)) {
            if ($shop->owner_id === $user->id) {
                return true;
            }
        } elseif ($user &&  $user->hasPermissionTo(Permission::STAFF)) {
            if ($shop->staffs->contains($user)) {
                return true;
            }
        }
        return false;
    }

    function csvToArray($filename = '', $delimiter = ',')
    {
        if (!file_exists($filename) || !is_readable($filename))
            return false;

        $header = null;
        $data = array();
        if (($handle = fopen($filename, 'r')) !== false) {
            while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
                if (!$header) {
                    $exclude = ['id', 'slug', 'deleted_at', 'created_at', 'updated_at', 'shipping_class_id'];
                    $row = array_diff($row, $exclude);
                    $header = $row;
                } else {
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }

        return $data;
    }

    /**
     * @Input Collection
     * @param Collection $modelCollection
     * @param $tableName
     * @throws CannotInsertRecord
     */
    function arrayToCsv(Collection $modelCollection, $tableName=null,$fieldList=null){
        $csv = Writer::createFromFileObject(new SplTempFileObject());
        $fields = $tableName ? Schema::getColumnListing($tableName):$fieldList;
        $csv->insertOne($fields);
        foreach ($modelCollection as $data){
            $csv->insertOne($data->toArray());
        }
        $flush_threshold = 1000;
        $content_callback = function () use ($csv, $flush_threshold) {
            foreach ($csv->chunk(1024) as $offset => $chunk) {
                echo $chunk;
                if ($offset % $flush_threshold === 0) {
                    flush();
                }
            }
        };
        $response = new StreamedResponse();
        $response->headers->set('Content-Encoding', 'none');
        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        if($tableName===null)$tableName=Str::uuid();
        $disposition = $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $tableName.'.csv'
        );
        $response->headers->set('Content-Disposition', $disposition);
        $response->headers->set('Content-Description', 'File Transfer');
        $response->setCallback($content_callback);
        return $response->send();
    }
}
