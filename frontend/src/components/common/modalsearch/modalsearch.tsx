import { Fragment, useEffect, useState, useRef } from 'react';
import { SidebarData } from '../sidebar/sidebardata';
import { Link } from 'react-router-dom';
import '../../../assets/css/modalsearch.css';
import '../../../assets/css/style.css';

const Modalsearch = ({ isOpen, onClose }: any) => {
  const modalRef: any = useRef(null);
  const [isHover, setIsHover] = useState(false);
  const [_show, setShow] = useState(isOpen);
  const [show1, setShow1] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [show2, setShow2] = useState(false);
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [searchval, setsearchval] = useState("Type something");
  const [NavData, setNavData] = useState([]);

  // Retrieve roles from localStorage
  const storedRoles = localStorage.getItem('user_roles');
  const roles = storedRoles ? JSON.parse(storedRoles) : [];
  const carpenterrole = localStorage.getItem('carpenterrole');
  console.log(carpenterrole);
  
  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filter SidebarData based on roles
  const filterSidebarData = () => {
    if (roles.includes("Administrator")) {
      const addUserIndex = SidebarData.findIndex(item => item.title === 'Add User');
      return addUserIndex !== -1 ? SidebarData.slice(0, addUserIndex + 1) : SidebarData;
    } else if (roles.includes("Admin")) {
      const faqIndex = SidebarData.findIndex(item => item.title === "FAQ's");
      return faqIndex !== -1 ? SidebarData.slice(0, faqIndex + 1) : SidebarData;
    } else if (carpenterrole === "Customer") {
      const startIndex = SidebarData.findIndex(item => item.title === 'Dashboard');
      const endIndex = SidebarData.findIndex(item => item.title === 'Help & Support');
      return startIndex !== -1 && endIndex !== -1 ? SidebarData.slice(startIndex, endIndex + 1) : [];
    } else {
      return SidebarData;
    }
  };

  const myfunction = (inputValue: any) => {
    document.querySelector(".search-result")?.classList.remove("d-none");

    const filteredSidebarData = filterSidebarData();
    const searchResults: any = [];

    filteredSidebarData.forEach((item: any) => {
      if (item.title.toLowerCase().includes(inputValue.toLowerCase())) {
        searchResults.push(item);
      }

      if (item.subNav) {
        item.subNav.forEach((subItem: any) => {
          if (subItem.title.toLowerCase().includes(inputValue.toLowerCase())) {
            searchResults.push(subItem);
          }

          if (subItem.subNav) {
            subItem.subNav.forEach((deepSubItem: any) => {
              if (deepSubItem.title.toLowerCase().includes(inputValue.toLowerCase())) {
                searchResults.push(deepSubItem);
              }
            });
          }
        });
      }
    });

    if (searchResults.length > 0 && inputValue !== "") {
      setShow1(true);
      setShow2(true);
      setsearchcolor("text-dark");
      setsearchval(`Search results for '${inputValue}'`);
      setNavData(searchResults);
    } else {
      setShow1(false);
      setShow2(false);
      setsearchcolor('text-danger');
      setsearchval("No results found");
    }
  };

  return (
    <Fragment>
      {isOpen && (
        <div id="search-modal" className="hs-overlay ti-modal mt-[1.75rem]">
          <div className="ti-modal-box" ref={modalRef}>
            <div className="ti-modal-content !border !border-defaultborder dark:!border-defaultborder !rounded-[0.5rem]">
              <div className="ti-modal-body m-4">
                <div className="input-group border-[2px] border-[var(--primaries)] rounded-[0.25rem] w-full flex">
                  <input
                    type="search"
                    className="form-control border-0 px-2 !text-[0.8rem] w-full focus:ring-transparent"
                    placeholder="Search"
                    aria-label="Search"
                    defaultValue={InputValue}
                    autoComplete="off"
                    onChange={(ele) => {
                      myfunction(ele.target.value);
                      setInputValue(ele.target.value);
                    }}
                  />
                </div>
                {show1 && (
                  <div className="box search-result relative z-[9] search-fix border border-gray-200 dark:border-white/10 mt-1 w-100">
                    <div className="box-header">
                      <h6 className="box-title me-2 text-break text-truncate">
                        {searchval}
                      </h6>
                    </div>
                    <div className="box-body p-2 flex flex-col max-h-[250px] overflow-auto">
                      {show2 ? (
                        NavData.map((e: any) => (
                          <div
                            key={Math.random()}
                            className="ti-list-group border p-2 gap-x-3.5 text-gray-800 dark:bg-bgdark dark:border-white/10 dark:text-white"
                          >
                            <Link
                              to={`${e.path}/`}
                              className="search-result-item"
                              onClick={() => {
                                setShow1(false);
                                setInputValue("");
                              }}
                            >
                              {e.title}
                            </Link>
                          </div>
                        ))
                      ) : (
                        <b className={`${searchcolor}`}>{searchval}</b>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Modalsearch;
