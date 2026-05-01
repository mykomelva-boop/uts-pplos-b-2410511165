<?php
namespace App\Controllers;
use App\Models\SupplierModel;
use CodeIgniter\RESTful\ResourceController;

class SupplierController extends ResourceController
{
    protected $modelName = 'App\Models\SupplierModel';
    protected $format    = 'json';

    public function index()
    {
        $page    = $this->request->getGet('page') ?? 1;
        $perPage = $this->request->getGet('per_page') ?? 10;
        $data    = $this->model->paginate($perPage, 'default', $page);
        return $this->respond([
            'data'     => $data,
            'page'     => (int)$page,
            'per_page' => (int)$perPage,
        ], 200);
    }

    public function show($id = null)
    {
        $supplier = $this->model->find($id);
        if (!$supplier) {
            return $this->failNotFound('Supplier tidak ditemukan');
        }
        return $this->respond($supplier, 200);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        if (!$this->model->validate($data)) {
            return $this->failValidationErrors($this->model->errors());
        }
        $id = $this->model->insert($data);
        return $this->respondCreated(['id' => $id, 'message' => 'Supplier berhasil dibuat']);
    }

    public function update($id = null)
    {
        $supplier = $this->model->find($id);
        if (!$supplier) {
            return $this->failNotFound('Supplier tidak ditemukan');
        }
        $data = $this->request->getJSON(true);
        $this->model->update($id, $data);
        return $this->respond(['message' => 'Supplier berhasil diupdate'], 200);
    }

    public function delete($id = null)
    {
        $supplier = $this->model->find($id);
        if (!$supplier) {
            return $this->failNotFound('Supplier tidak ditemukan');
        }
        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Supplier berhasil dihapus']);
    }
}