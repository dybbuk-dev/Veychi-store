<?php

namespace Marvel\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class DNIDocumentCreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "DNI" => ['required', 'string', 'max:191'],
            "DNI_document"=>['required','mimes:jpg']
        ];
    }

    /**
     * Get the error messages that apply to the request parameters.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'DNI.required' => 'DNI is required',
            'DNI.string' => 'DNI is not a valid string',
            'DNI.max:191' => 'DNI can not be more than 191 character',
            'DNI_document.required' => 'DNI photo is required',
            'DNI_document.mime' => 'DNI photo is not valid',


        ];
    }

    public function failedValidation(Validator $validator)
    {
        // TODO: Need to check from the request if it's coming from GraphQL API or not.
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
