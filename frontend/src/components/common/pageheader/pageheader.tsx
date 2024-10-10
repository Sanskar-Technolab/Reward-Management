import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default function Pageheader(props: any) {
    console.log("props.currentpage---", props.currentpage);
    return (
        <Fragment>
            <div className="block justify-between page-header md:flex mt-5">
                <div>
                    <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white dark:hover:text-white text-lg font-semibold">{props.currentpage}</h3>
                </div>
                <ol className="flex items-center whitespace-nowrap min-w-0">
                    <li className="text-defaultsize ps-[0.5rem]">
                        <Link className="flex items-center text-[var(--primaries)] hover:text-[var(--primaries)] dark:text-primary truncate" to={props.activepage}>
                            {props.activepagename}
                            {/* {props.activepagename && props.activepage && (
                                <i className="ti ti-chevrons-right flex-shrink-0 text-[#8c9097] dark:text-white/50 px-[0.5rem] overflow-visible rtl:rotate-180"></i>
                            )} */}
                        </Link>
                    </li>
                    <li className="text-defaultsize text-defaulttextcolor font-semibold hover:text-[var(--primaries)] dark:text-[#8c9097] dark:text-white/50" aria-current="page">
                    {props.mainpagename && (
                                <i className="ti ti-chevrons-left flex-shrink-0 text-[#8c9097] dark:text-white/50 px-[0.5rem] overflow-visible rtl:rotate-180"></i>
                            )}
                        {props.mainpagename}
                      
                    </li>
                </ol>
            </div>
        </Fragment>
    );
}
