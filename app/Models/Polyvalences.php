<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Polyvalences extends Model
{
    use SoftDeletes;
    use HasFactory;
    protected $fillable = ['id', 'name'];
    // Define the many-to-many relationship with Employee
    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'emp_polys', 'id_polyvalence', 'id_emp')
                    ->withTimestamps(); // Include timestamps if you need them
    }
}
