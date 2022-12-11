<?php

namespace Marvel\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CompanyCreateRequest extends FormRequest
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
            "name" => ['required', 'string', 'max:191'],
            "line_of_business" => ['required', 'string', 'max:191'],
            "physical_address" => ['required', 'string'],
            "fiscal_address" => ['required', 'max:191'],
            "tax_country" => ['required', 'max:191'],
            "business_phone" => ['max:191'],
            "products_description" => ['required', 'max:191'],
            "user_id" => ['required', "exists:Users,id"],
            "legal_representative" => ['required', 'array'],
            "legal_representative.dni_document.id"=>["required","exists:dni_document,id"],
            "dni_document" => ['required', 'array'],
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
            'name.required' => 'Name is required',
            'name.string' => 'Name is not a valid string',
            'name.max:191' => 'Name can not be more than 191 character',
            'line_of_business.required' => 'email is required',
            'line_of_business.string' => 'email is not a valid email address',
            'line_of_business.max:191' => 'Line of business can not be more than 191 character',
            'physical_address.required' => 'Physical address is required',
            'physical_address.string' => 'Physical address is not a valid string',
            'tax_country.required' => 'Tax country is not a valid string',
            'tax_country.max:191' => 'Tax country can not be more than 191 character',
            'business_phone.max:191' => 'Business phone can not be more than 191 character',
            'products_description.max:191' => 'Product description can not be more than 191 character',
            'user_id.exist:user,id' => 'User does not exist',
            'user_id.required' => 'User is required',
            'legal_representative.required' => 'Legal representative is required',
            'legal_representative.array' => 'Legal representative is not valid json',
            'dni_document.required' => 'DNI document is required',
            'dni_document.array' => 'DNI document is not valid json'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        // TODO: Need to check from the request if it's coming from GraphQL API or not.
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}
