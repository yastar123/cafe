import { seedMenuItems, seedAdminUser } from '../actions/seed'

export const dynamic = 'force-dynamic'

export default async function SeedPage() {
  const menuResult = await seedMenuItems()
  const adminResult = await seedAdminUser()

  return (
    <div className="p-8 max-w-md mx-auto space-y-6 mt-10">
      <h1 className="text-2xl font-bold text-center text-primary">Database Seeder</h1>
      
      <div className="bg-card p-6 rounded-lg border border-primary/10 space-y-4">
        <div>
          <h2 className="font-semibold mb-1">Menu Items Seeding:</h2>
          <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-40">
            {JSON.stringify(menuResult, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="font-semibold mb-1">Admin User Seeding:</h2>
          <pre className="text-sm bg-muted p-3 rounded overflow-auto max-h-40">
            {JSON.stringify(adminResult, null, 2)}
          </pre>
        </div>
      </div>

      <div className="text-center">
        <a 
          href="/" 
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 text-sm font-medium transition-colors"
        >
          Go to Home Page
        </a>
      </div>
    </div>
  )
}
