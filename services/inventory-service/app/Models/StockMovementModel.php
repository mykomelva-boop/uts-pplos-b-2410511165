<?php
namespace App\Models;
use CodeIgniter\Model;

class StockMovementModel extends Model
{
    protected $table         = 'stock_movements';
    protected $primaryKey    = 'id';
    protected $returnType    = 'array';
    protected $allowedFields = ['item_id', 'location_id', 'type', 'quantity', 'note'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
    protected $validationRules = [
        'item_id'     => 'required|integer',
        'location_id' => 'required|integer',
        'type'        => 'required|in_list[in,out]',
        'quantity'    => 'required|integer|greater_than[0]',
    ];
}