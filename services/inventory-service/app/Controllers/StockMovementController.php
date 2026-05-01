<?php
namespace App\Controllers;
use App\Models\StockMovementModel;
use CodeIgniter\RESTful\ResourceController;

class StockMovementController extends ResourceController
{
    protected $modelName = 'App\Models\StockMovementModel';
    protected $format    = 'json';

    public function index()
    {
        $page     = $this->request->getGet('page') ?? 1;
        $perPage  = $this->request->getGet('per_page') ?? 10;
        $type     = $this->request->getGet('type');
        $item_id  = $this->request->getGet('item_id');

        $model = new StockMovementModel();
        if ($type) {
            $model->where('type', $type);
        }
        if ($item_id) {
            $model->where('item_id', $item_id);
        }

        $data = $model->paginate($perPage, 'default', $page);
        return $this->respond([
            'data'     => $data,
            'page'     => (int)$page,
            'per_page' => (int)$perPage,
        ], 200);
    }

    public function show($id = null)
    {
        $movement = $this->model->find($id);
        if (!$movement) {
            return $this->failNotFound('Data pergerakan stok tidak ditemukan');
        }
        return $this->respond($movement, 200);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->validate($data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        $id = $this->model->insert($data);
        return $this->respondCreated(['id' => $id, 'message' => 'Pergerakan stok berhasil dicatat']);
    }

    public function delete($id = null)
    {
        $movement = $this->model->find($id);
        if (!$movement) {
            return $this->failNotFound('Data pergerakan stok tidak ditemukan');
        }
        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Data berhasil dihapus']);
    }
}