const Loader = () => {

  return (
    <section className="loader">
      <div></div>
    </section>
  );
};

export const LoaderLayout = () => {
  return (
    <section
      style={{
        height: "calc(100vh - 4rem)",
      }}
      className="loader"
    >
      <div></div>
    </section>
  );
};

export default Loader;


interface SkeletonProps{
  width : string;
  count: number;
}
export const Skeleton = ( {width =" unset"}: {width : string , count : 3}) =>{
 

  return (
    <div className="skeleton-loader"  style={{width}}>
      <div className="skeleton-shape" >
      
    </div>
     <div className="skeleton-shape" >
      
    </div>
     <div className="skeleton-shape" >
      
    </div>
    </div>
  );
};