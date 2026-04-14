<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SsoClient extends Model
{
    protected $connection = 'pilargroup';
    protected $table      = 'sso_clients';
    protected $primaryKey = 'id';
    public $incrementing  = false;
    protected $keyType    = 'string';

    protected $fillable = ['id', 'project_id', 'client_secret', 'redirect_uris', 'is_active'];
    protected $hidden   = ['client_secret'];

    public function project()
    {
        return $this->belongsTo(MasterProject::class, 'project_id');
    }

    public function getRedirectUrisAttribute($value): array
    {
        return json_decode($value, true) ?? [];
    }
}