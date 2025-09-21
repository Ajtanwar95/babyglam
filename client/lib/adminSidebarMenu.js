import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";

export const adminAppSidebarMenu=[
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: AiOutlineDashboard,
    },
    {
        title: "Category",
        url: "#",
        icon: BiCategory,
        submenu:[
            {
                title: "Add Category",
                url: "ADMIN_ADD_CATEGORY",
            },
            {
                title: "All Categories",
                url: "ADMIN_VIEW_CATEGORIES",
            }
        ]
    },
    {
        title: "Products",
        url: "#",
        icon: IoShirtOutline,
        submenu:[
            {
                title: "Add Products",
                url: "/admin/products/add",
            },
            {
                title: "Add Variant",
                url: "#",
            },
            {
                title: "All Products",
                url: "/admin/products/allProducts",
            },
            {
                title: "Product Variants",
                url: "#",
            }
        ]
    },
    {
        title: "Coupons",
        url: "#",
        icon: RiCoupon2Line,
        submenu:[
            {
                title: "Add Coupon",
                url: "#",
            },
            {
                title: "All Coupons",
                url: "#",
            }
        ]
    },
    {
        title: "Orders",
        url:"#",
        icon: MdOutlineShoppingBag,
    },
    {
        title:"Customers",
        url:"#",
        icon: LuUserRound,
    },
    {
        title: "Reviews & Ratings",
        url: "#",
        icon: IoMdStarOutline,
    },
    {
        title: "Media",
        url: "#",
        icon: MdOutlinePermMedia,
    },
   
]