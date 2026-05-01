<?php
namespace App\Models;
use CodeIgniter\Model;

class ItemModel extends Model
{
    protected $table         = 'items';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $allowedFields = ['name', 'description', 'unit', 'supplier_id'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
    protected $validationRules = [
        'name' => 'required|min_length[2]|max_length[100]',
        'unit' => 'required',
    ];
}