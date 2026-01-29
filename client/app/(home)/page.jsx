import Banner from "../components/Banner/Banner";
import Sliderbanner from "../components/Banner/Sliderbanner";
import Categories from "../components/Categories/Categories";
import FeaturedProducts from "../components/Products/FeaturedProducts";

export default function HomePage() {
  return (
    <div>
      <Sliderbanner/>
      <Banner />
      <Categories/>
      <FeaturedProducts/>
    </div>
  )
}
