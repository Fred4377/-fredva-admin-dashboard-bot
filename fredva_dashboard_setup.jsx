// FredVA Admin Dashboard (React + Tailwind)
// This is the production-ready dashboard frontend code
// You can deploy this on Vercel or Netlify

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">FredVA Admin Dashboard</h1>

      <Tabs defaultValue="overview" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="mb-4">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Bot Status</h2>
              <p>✅ Bot is Active and Working</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">Today’s Summary</h2>
              <ul className="list-disc list-inside">
                <li>Prospected: 250 Companies</li>
                <li>Cold Emails Sent: 250</li>
                <li>Follow-ups: 150</li>
                <li>Payments Received: 3</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
              <Input placeholder="Search task..." className="mb-4" />
              <ul className="space-y-2">
                <li>📝 Entered 450 leads into Google Sheet for client A</li>
                <li>🧹 Cleaned up Airtable CRM for client B</li>
                <li>📧 Sent 3 follow-ups to prospect X</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Clients</h2>
              <ul className="space-y-2">
                <li>👤 Fred Otieno - fredvirtualassistant040@gmail.com</li>
                <li>👤 Jane Mwangi - janewa@gmail.com</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Payments</h2>
              <ul className="space-y-2">
                <li>✅ $85 received from client A via PayPal</li>
                <li>✅ $120 received from client B via Stripe</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-10">
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          Add New Task
        </Button>
      </div>
    </main>
  );
}
