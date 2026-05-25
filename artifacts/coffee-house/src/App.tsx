import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import SignUpPage from "@/pages/auth/SignUpPage";
import SignUpSuccessPage from "@/pages/auth/SignUpSuccessPage";
import MenuPage from "@/pages/MenuPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminMenuPage from "@/pages/admin/AdminMenuPage";
import AdminPaymentsPage from "@/pages/admin/AdminPaymentsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
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
      <Route>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
            <p className="text-muted-foreground">Halaman tidak ditemukan</p>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
      <Toaster richColors position="top-center" />
    </WouterRouter>
  );
}

export default App;
