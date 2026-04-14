public function projects()
{
    return $this->hasManyThrough(
        MasterProject::class,
        CentralUserProject::class,
        'user_id',
        'id',
        'id',
        'project_id'
    );
}

public function hasProjectAccess(string $slug): bool
{
    return $this->projects()->where('slug', $slug)->exists();
}