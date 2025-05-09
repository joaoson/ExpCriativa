import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartBarBig, ChartLine, ChartPie, Database, Calendar, Users, BadgeDollarSign } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="flex flex-col space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Donation Analytics</h1>
        <p className="text-muted-foreground">Detailed metrics and insights for your organization</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartLine size={20} className="text-lumen-500" />
              <span>Donation Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ChartLine className="mx-auto h-16 w-16 opacity-50" />
                <p className="mt-2">Donation trend visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} className="text-lumen-500" />
              <span>Donor Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ChartBarBig className="mx-auto h-16 w-16 opacity-50" />
                <p className="mt-2">New donor acquisition</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartPie size={20} className="text-lumen-500" />
              <span>Donation Demographics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ChartPie className="mx-auto h-16 w-16 opacity-50" />
                <p className="mt-2">Donor demographics visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Database className="mx-auto h-16 w-16 opacity-50" />
              <p className="mt-2">Advanced financial analysis will appear here</p>
              <p className="text-sm">Compare metrics across campaigns, time periods, and donor segments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;