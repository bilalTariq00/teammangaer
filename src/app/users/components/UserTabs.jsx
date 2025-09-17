"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "./UserTable";

const UserTabs = ({ 
  activeTab, 
  onTabChange, 
  permanentUsers, 
  traineeUsers, 
  onEditUser, 
  onDeleteUser, 
  onWorkerClick 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
      <div className="px-6 pt-2 pb-4 border-b bg-gray-50 flex  justify-between">
        <div className="flex items-center justify-between mb-2">
          {/* <div className="text-sm text-gray-600">
            Active Tab: <span className="font-semibold text-blue-600">{activeTab}</span>
          </div> */}
          <div className="text-sm text-gray-500">
            {activeTab === "permanent" ? permanentUsers.length : traineeUsers.length} users
          </div>
        </div>
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-white border shadow-sm">
          <TabsTrigger 
            value="permanent"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg font-medium"
          >
            Permanent
          </TabsTrigger>
          <TabsTrigger 
            value="trainee"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg font-medium"
          >
            Trainee
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="permanent" className="flex-1 m-0 p-0">
        <UserTable 
          users={permanentUsers}
          onEditUser={onEditUser}
          onDeleteUser={onDeleteUser}
          onWorkerClick={onWorkerClick}
        />
      </TabsContent>
      
      <TabsContent value="trainee" className="flex-1 m-0 p-0">
        <UserTable 
          users={traineeUsers}
          onEditUser={onEditUser}
          onDeleteUser={onDeleteUser}
          onWorkerClick={onWorkerClick}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserTabs;
