import AgeGender from '@/Components/charts/AgeGender';
import CategoriesGender from '@/Components/charts/CategoriesGender';
import EmployeePresenceChart from '@/Components/charts/EmployeePresenceChart';
import GenderChart from '@/Components/charts/Gender';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from 'primereact/button';

export default function Dashboard(props) {
  const employees = props.employees || [];
  const categories = props.categories || [];
  const presents = props.presents || [];
  const departments = props.departments || [];
  
  console.log(props.departments);
  

  // Count the number of male and female employees
  const nbWorkerMale = employees.filter(employee => employee.gender === 'Homme').length;
  const nbWorkerFemale = employees.filter(employee => employee.gender === 'Femme').length;



  
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={"Tableau du board"}
        >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 flex-wrap">
          
          <div className="p-2">
              <div class="w-full px-8 bg-white dark:bg-slate-800 py-4 rounded-md">
                <div class="wow fadeInUp group" data-wow-delay=".15s" style={{visibility: "visible", animationDelay: "0.15s"}}>
                  <div className='flex flex-col md:flex-row w-full justify-between items-center'>
                      <div class="relative z-10 mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary">
                        <span class="absolute left-0 top-0 -z-[1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary bg-opacity-20 duration-300 group-hover:rotate-45"></span>
                        <i className="ti ti-users ti-xl text-white"></i>
                      </div>
                      <h4 class="mb-3 text-6xl font-bold text-dark dark:text-white">
                        {props.employees.length}
                      </h4>
                  </div>
                  <p class="mb-2 text-body-color text-base font-bold dark:text-dark-6">
                    Nombre d'employées
                  </p>
                  <Link href={route('workers')} class="text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary">
                    <span className="mr-2">Voir les employées</span>
                    <i className="ti ti-external-link"></i>
                  </Link>
                </div>
              </div>
          </div>
          <div className="p-2">
              <div class="w-full px-8 bg-white dark:bg-slate-800 py-4 rounded-md">
                <div class="wow fadeInUp group" data-wow-delay=".15s" style={{visibility: "visible", animationDelay: "0.15s"}}>
                  <div className='flex flex-col md:flex-row w-full justify-between items-center'>
                      <div class="relative z-10 mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary">
                        <span class="absolute left-0 top-0 -z-[1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary bg-opacity-20 duration-300 group-hover:rotate-45"></span>
                        <i className="ti ti-user-check ti-xl text-white"></i>
                      </div>
                      <h4 class="mb-3 text-6xl font-bold text-dark dark:text-white">
                        {props.numberOfEmployeesPresent}
                      </h4>
                  </div>
                  <p class="mb-2 text-body-color text-base font-bold dark:text-dark-6">
                    Nombre d'employées présents
                  </p>
                  
                  <Link href={route('presence')} class="text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary">
                    <span className="mr-2">Voir les présences</span>
                    <i className="ti ti-external-link"></i>
                  </Link>
                </div>
              </div>
          </div>
          <div className="p-2">
              <div class="w-full px-8 bg-white dark:bg-slate-800 py-4 rounded-md">
                <div class="wow fadeInUp group" data-wow-delay=".15s" style={{visibility: "visible", animationDelay: "0.15s"}}>
                  <div className='flex flex-col md:flex-row w-full justify-between items-center'>
                      <div class="relative z-10 mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary">
                        <span class="absolute left-0 top-0 -z-[1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary bg-opacity-20 duration-300 group-hover:rotate-45"></span>
                        <i className="ti ti-man ti-xl text-white"></i>
                      </div>
                      <h4 class="mb-3 text-6xl font-bold text-dark dark:text-white">
                      {nbWorkerMale}
                      </h4>
                  </div>
                  <p class="mb-2 text-body-color text-base font-bold dark:text-dark-6">
                    Homme
                  </p>
                  
                  <Link href={route('workers')} class="text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary">
                    <span className="mr-2">Voir les employeés</span>
                    <i className="ti ti-external-link"></i>
                  </Link>
                </div>
              </div>
          </div>
          <div className="p-2">
              <div class="w-full px-8 bg-white dark:bg-slate-800 py-4 rounded-md">
                <div class="wow fadeInUp group" data-wow-delay=".15s" style={{visibility: "visible", animationDelay: "0.15s"}}>
                  <div className='flex flex-col md:flex-row w-full justify-between items-center'>
                      <div class="relative z-10 mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary">
                        <span class="absolute left-0 top-0 -z-[1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary bg-opacity-20 duration-300 group-hover:rotate-45"></span>
                        <i className="ti ti-woman ti-xl text-white"></i>
                      </div>
                      <h4 class="mb-3 text-6xl font-bold text-dark dark:text-white">
                      {nbWorkerFemale}
                      </h4>
                  </div>
                  <p class="mb-2 text-body-color text-base font-bold dark:text-dark-6">
                    Femme
                  </p>
                  <Link href={route('workers')} class="text-base font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary">
                    <span className="mr-2">Voir les employeés</span>
                    <i className="ti ti-external-link"></i>
                  </Link>
                </div>
              </div>
          </div>
          
          
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1">
          <div className="p-2 h-full">
            <div className="w-full h-full px-8 bg-white dark:bg-slate-800 py-4 rounded-md">
              <GenderChart nbWorkerMale={nbWorkerMale} nbWorkerFemale={nbWorkerFemale} />
            </div>
          </div>
          <div className="p-2 md:col-span-2">
            <div className="w-full px-8 bg-white dark:bg-slate-800 py-4 rounded-md">
              <AgeGender employees={employees}/>
            </div>
          </div>
          <div className="p-2 md:col-span-3">
            <div className="w-full px-8 bg-white dark:bg-slate-800 py-4 rounded-md">
              <CategoriesGender employees={employees} categories={categories}/>
            </div>
          </div>
          <div className="p-2 md:col-span-3">
            <div className="w-full px-8 bg-white dark:bg-slate-800 py-4 rounded-md">
              <EmployeePresenceChart data={presents} departments={departments}/>
            </div>
          </div>
          </div>
        </AuthenticatedLayout>
    );
}
