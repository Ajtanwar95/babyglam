import Banner from "../components/Banner/Banner";
import Categories from "../components/Categories/Categories";
import FeaturedProducts from "../components/Products/FeaturedProducts";

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Categories/>
      <FeaturedProducts/>
    </div>
  )
}
