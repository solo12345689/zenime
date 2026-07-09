import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import getCategoryInfo from "@/src/utils/getCategoryInfo.utils";
import CategoryCard from "@/src/components/categorycard/CategoryCard";
import Genre from "@/src/components/genres/Genre";
import Error from "@/src/components/error/Error";
import { useHomeInfo } from "@/src/context/HomeInfoContext";
import PageSlider from "@/src/components/pageslider/PageSlider";
import SidecardLoader from "@/src/components/Loader/Sidecard.loader";
import CategoryCardLoader from "@/src/components/Loader/CategoryCard.loader";

function Category({ path, label }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const page = parseInt(searchParams.get("page")) || 1;
  const { homeInfo, homeInfoLoading } = useHomeInfo();

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategoryInfo(path, page);
        setCategoryInfo(data.data);
        setTotalPages(data.totalPage);
      } catch (err) {
        console.error("Error fetching category info:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [path, page]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({ page: newPage });
    }
  };

  if (error) return <Error />;

  return (
    <div className="w-full px-4 max-[1200px]:px-0">
      <div className="grid grid-cols-[minmax(0,75%),minmax(0,25%)] gap-x-6 max-[1200px]:flex flex-col max-[1200px]:px-4">
        <div>
          {loading ? (
            <CategoryCardLoader />
          ) : (
            <>
              {categoryInfo && categoryInfo.length > 0 && (
                <CategoryCard
                  label={label.split("/").pop()}
                  data={categoryInfo}
                  showViewMore={false}
                  className={"mt-0"}
                  categoryPage={true}
                  path={path}
                />
              )}
              <PageSlider
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </>
          )}
        </div>

        <div className="w-full flex flex-col gap-y-10">
          {homeInfoLoading && !homeInfo ? (
            <SidecardLoader />
          ) : (
            <>
              {homeInfo?.genres && <Genre data={homeInfo.genres} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
