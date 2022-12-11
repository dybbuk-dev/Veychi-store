<?php

namespace Marvel\Database\Repositories;

use Marvel\Database\Models\Countries;
use Prettus\Repository\Criteria\RequestCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class CountriesRepository extends BaseRepository
{
    public function boot()
    {
        try {
            $this->pushCriteria(app(RequestCriteria::class));
        } catch (RepositoryException $e) {
        }
    }
    public function model(): string
    {
        return Countries::class;
    }

}
