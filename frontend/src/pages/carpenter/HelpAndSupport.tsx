  import  {  Fragment, useEffect,useState } from 'react';
import Pageheader from '../../components/common/pageheader/pageheader';
import { useFrappeGetDocList } from 'frappe-react-sdk';

interface FAQ {
  name: string;
  question?: string;
  answer:string;
  status: string;
  created_date?: string;
}

const Faqs = () => {
  const [faqData, setFaqData] = useState<FAQ[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<any>(0);
  

  const { data } = useFrappeGetDocList<FAQ>('FAQ', {
    fields: ['name', 'question', 'status', 'created_date', 'answer'],
    filters: [['status', '=', 'Active']],
  });

  
  useEffect(() => {
    document.title='Help and Support';
    if (data) {
    console.log("faq data",data);
      setFaqData(data);
    }
  }, [data]);

  const stripHTML = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  

  return(
  <Fragment>
        <Pageheader 
                currentpage={"Faq's"} 
                activepage={"/help-and-support"} 
                // mainpage={"/help-and-support"} 
                activepagename="Faq's"
                // mainpagename="Faq's"
            />
    {/* <Pageheader currentpage="Faq's" activepage="" mainpage="Faq's" /> */}
      <div className="grid grid-cols-12 mb-[3rem] !mx-auto">
        <div className="xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 !mx-auto">
            <div className="xl:col-span-3 col-span-12"></div>
            <div className="xl:col-span-6 col-span-12">
              <div className="text-center p-4 faq-header mb-6">
                <h5 className="mb-1 text-[1.25rem] text-primary opacity-[5] font-semibold">F.A.Q's</h5>
                <h4 className="mb-1 text-[1.5rem] text-defaulttextcolor font-semibold">Frequently Asked Questions</h4>
                <p className="text-[.9375rem] text-[#8c9097] dark:text-white/50 opacity-[7]">We have shared some of the most frequently asked questions to help you out! </p>
              </div>
            </div>
            <div className="xl:col-span-3 col-span-12"></div>
          </div>
        </div>
        <div className="xl:col-span-1 col-span-12"></div>
        <div className="xl:col-span-10 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xl:col-span-12 col-span-12">
              <div className="box">
                <div className="box-header">
                  <div className="box-title text-[.9375rem] text-defaulttextcolor font-bold p-[1.25rem] ">
                    General Topics ?
                  </div>
                  <hr />
                </div>
                <div className="box-body">
                  <div className="hs-accordion-group">
                    
                  {faqData.map((faq, index) => (
        <div
          key={faq.name}
          className="hs-accordion overflow-hidden border -mt-px first:rounded-t-sm last:rounded-b-sm dark:bg-bgdark dark:border-white/10"
          id={`hs-accordion-heading-${index}`}
        >
          <button
            className={`group py-4 px-5 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start transition ${
              expandedIndex === index
                ? 'text-primary bg-primary/10 dark:text-primary'  // Active styles
                : 'text-gray-800 hover:text-gray-500 dark:text-gray-200 dark:hover:text-white/80'  // Inactive styles
            }`}
            aria-controls={`hs-accordion-collapse-${index}`}
            type="button"
            onClick={() => toggleAccordion(index)}
          >
            {faq.question}
            <svg
              className={`w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-[#8c9097] ${expandedIndex === index ? 'hidden' : 'block'}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <svg
              className={`w-3 h-3 text-gray-600 group-hover:text-gray-500 dark:text-[#8c9097] ${expandedIndex === index ? 'block' : 'hidden'}`}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div
            id={`hs-accordion-collapse-${index}`}
            className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${expandedIndex === index ? 'block' : 'hidden'}`}
            aria-labelledby={`hs-accordion-heading-${index}`}
          >
            {/* <p className="py-4 px-5">
              {stripHTML(faq.answer)}
            </p> */}
              <p className="py-4 px-5" dangerouslySetInnerHTML={{ __html: faq.answer }} />
          </div>
        </div>
      ))}
                   
                  </div>
                </div>
              </div>
            </div>
         
            
          </div>
        </div>
       
      </div>
  </Fragment>
);}

export default Faqs;
