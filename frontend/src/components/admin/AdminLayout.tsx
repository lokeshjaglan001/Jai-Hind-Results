import Navbar from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"

export default function AdminLayout({children}:{children: React.ReactNode}) {
  return (
    <div className="">
      <Navbar />
      <div className="flex-1 max-h-screen h-screen overflow-y-auto pt-16">
        {children}
      </div>
    </div>
  )
}
