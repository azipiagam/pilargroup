<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MasterProject extends Model
{
    protected $connection = 'pilargroup';
    protected $table      = 'master_projects';
    protected $primaryKey = 'id';
    public $incrementing  = false;
    protected $keyType    = 'string';

    protected $fillable = ['id', 'name', 'slug', 'url', 'description', 'is_active'];

    public function ssoClient()
    {
        return $this->hasOne(SsoClient::class, 'project_id');
    }

    public function userProjects()
    {
        return $this->hasMany(CentralUserProject::class, 'project_id');
    }
}