<?php

namespace Marvel\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class LegalRepresentativeUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }
    public function rules()
    {
        return [
            'dni_document_id'=>['required','exists:dni_document,id'],
            'name' => ["required","string"],
            "phone" => ["string"]
        ];
    }
    public function messages()
    {
        return [
            'dni_document_id.required'=>"DNI document is required",
            'dni_document_id.exists'=> "DNI document does not exists",
            "phone.string" => "Phone number is not valid"
        ];
    }
    public function failedValidation(Validator $validator)
    {
        // TODO: Need to check from the request if it's coming from GraphQL API or not.
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
