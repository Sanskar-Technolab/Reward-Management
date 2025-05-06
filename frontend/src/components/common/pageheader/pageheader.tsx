import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default function Pageheader(props: any) {
    const { currentpage, mainpagename, activepage, activepagename } = props;
    const showIcon = mainpagename && activepagename;
    const showLink = mainpagename && activepage; // Only wrap with Link if mainpagename and activepage exist

    return (
        <Fragment>
            <div className="block justify-between page-header md:flex mt-5">
                <div>
                    <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white dark:hover:text-white text-lg font-semibold">
                        {currentpage}
                    </h3>
                </div>
                <ol className="flex items-center whitespace-nowrap min-w-0">
                    {activepagename && (
                      <li className="text-defaultsize text-defaulttextcolor hover:text-[var(--primaries)] dark:text-[#8c9097] dark:text-white/50" aria-current="page">
                      {showLink ? (
                          <Link
                              className="flex items-center text-[var(--primaries)] hover:text-[var(--primaries)] dark:text-primary truncate "
                              to={activepage}
                          >    
                          <span className='hover:underline'>{activepagename}</span>                          
                          

                              {showIcon && (
                                  <i className="ti ti-chevrons-right flex-shrink-0  dark:text-white/50 px-[0.5rem] overflow-visible rtl:rotate-180"></i>
                              )}
                          </Link>
                      ) : (
                          <span className="flex items-center truncate">
                              {activepagename}
                          </span>
                      )}
                  </li>
                    )}
                    {activepagename && (
                         <li className="text-defaultsize ps-[0.5rem] font-normal">
                         {mainpagename}
                     </li>
                        
                    )}
                </ol>
            </div>
        </Fragment>
    );
}
