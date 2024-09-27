import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from 'primereact/button';

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={"Tableau du board"}
        >
            <div class="-mx-4 grid grid-cols-4 flex-wrap">
          
          <div className="p-2">
              <div class="w-full px-8 bg-white dark:bg-slate-800 py-4 rounded-md">
                <div class="wow fadeInUp group" data-wow-delay=".15s" style={{visibility: "visible", animationDelay: "0.15s"}}>
                  <div className='flex flex-col md:flex-row w-full justify-between items-center'>
                      <div class="relative z-10 mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-[14px] bg-primary">
                        <span class="absolute left-0 top-0 -z-[1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-[14px] bg-primary bg-opacity-20 duration-300 group-hover:rotate-45"></span>
                        <i className="ti ti-users ti-xl text-white"></i>
                      </div>
                      <h4 class="mb-3 text-6xl font-bold text-dark dark:text-white">
                        63
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
                        <i className="ti ti-users ti-xl text-white"></i>
                      </div>
                      <h4 class="mb-3 text-6xl font-bold text-dark dark:text-white">
                        63
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
          
        </div>
        </AuthenticatedLayout>
    );
}
