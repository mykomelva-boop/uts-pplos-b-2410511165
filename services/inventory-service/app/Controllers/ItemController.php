<?php
namespace App\Controllers;
use App\Models\ItemModel;
use CodeIgniter\RESTful\ResourceController;

class ItemController extends ResourceController
{
    protected $modelName = 'App\Models\ItemModel';
    protected $format    = 'json';

    public function index()
    {
        $page     = $this->request->getGet('page') ?? 1;
        $perPage  = $this->request->getGet('per_page') ?? 10;
        $name     = $this->request->getGet('name');

        $model = new ItemModel();
        if ($name) {
            $model->like('name', $name);
        }

        $data = $model->paginate($perPage, 'default', $page);
        return $this->respond([
            'data'  => $data,
            'page'  => (int)$page,
            'per_page' => (int)$perPage,
        ], 200);
    }

    public function show($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->failNotFound('Item tidak ditemukan');
        }
        return $this->respond($item, 200);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->validate($data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        $id = $this->model->insert($data);
        return $this->respondCreated(['id' => $id, 'message' => 'Item berhasil dibuat']);
    }

    public function update($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->failNotFound('Item tidak ditemukan');
        }
        $data = $this->request->getJSON(true);
        $this->model->update($id, $data);
        return $this->respond(['message' => 'Item berhasil diupdate'], 200);
    }

    public function delete($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->failNotFound('Item tidak ditemukan');
        }
        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Item berhasil dihapus']);
    }
}