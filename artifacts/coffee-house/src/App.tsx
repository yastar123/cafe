import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import ConfigBanner from "@/components/ConfigBanner";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import SignUpSuccessPage from "@/pages/auth/SignUpSuccessPage";
import MenuPage from "@/pages/MenuPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import OrdersPage from "@/pages/OrdersPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminMenuPage from "@/pages/admin/AdminMenuPage";
import AdminPaymentsPage from "@/pages/admin/AdminPaymentsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminRekapPage from "@/pages/admin/AdminRekapPage";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-auto lg:pt-0 pt-14">{children}</main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/sign-up" component={SignUpPage} />
      <Route path="/auth/sign-up-success" component={SignUpSuccessPage} />
      <Route path="/menu" component={MenuPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/orders" component={OrdersPage} />
      <Route path="/order-success" component={OrderSuccessPage} />
      <Route path="/admin">
        {() => (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/orders">
        {() => (
          <AdminLayout>
            <AdminOrdersPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/menu">
        {() => (
          <AdminLayout>
            <AdminMenuPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/categories">
        {() => (
          <AdminLayout>
            <AdminCategoriesPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/payments">
        {() => (
          <AdminLayout>
            <AdminPaymentsPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/users">
        {() => (
          <AdminLayout>
            <AdminUsersPage />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/rekap">
        {() => (
          <AdminLayout>
            <AdminRekapPage />
          </AdminLayout>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
      <ConfigBanner />
      <Toaster richColors position="top-center" />
    </WouterRouter>
  );
}

export default App;
