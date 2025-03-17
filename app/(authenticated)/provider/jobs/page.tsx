"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BadgePlus, MoreHorizontal, Pencil, Trash2, FileDown, Eye, Users } from "lucide-react"
import { AddRoleDialog } from "./add-role-dialog"
import { useAuth } from "@/contexts/auth-context"
import jobRolesData from "@/data/job-roles.json"
import interviewsData from "@/data/interviews.json"

interface JobRole {
  id: string
  companyId: string
  title: string
  description: string
  skills: string[]
  level: string
  active: boolean
  location: string
  salary: string
}

export default function ProviderJobsPage() {
  const { user } = useAuth()
  const [jobRoles, setJobRoles] = useState<JobRole[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchJobRoles = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Filter job roles by the provider's company
        const companyJobs = (jobRolesData as JobRole[]).filter((job) => job.companyId === user?.companyId)

        setJobRoles(companyJobs)

        // Count applications per job
        const interviews = interviewsData as any[]
        const counts: Record<string, number> = {}

        interviews.forEach((interview) => {
          if (interview.companyId === user?.companyId) {
            counts[interview.jobRoleId] = (counts[interview.jobRoleId] || 0) + 1
          }
        })

        setApplicationCounts(counts)
      } catch (error) {
        console.error("Error fetching job roles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.companyId) {
      fetchJobRoles()
    }
  }, [user])

  const handleAddRole = (newRole: JobRole) => {
    setJobRoles([...jobRoles, newRole])
  }

  const filteredRoles = jobRoles.filter(
    (role) =>
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Job Listings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your company's job listings</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button asChild variant="outline">
            <Link href="#">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Link>
          </Button>
          <Button onClick={() => setIsAddRoleOpen(true)}>
            <BadgePlus className="mr-2 h-4 w-4" />
            Add New Job
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Job Listings</CardTitle>
          <CardDescription>{jobRoles.length} jobs posted by your company</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No job listings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.title}</TableCell>
                        <TableCell>{role.level}</TableCell>
                        <TableCell>{role.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{applicationCounts[role.id] || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={role.active ? "default" : "secondary"}
                            className={role.active ? "bg-green-500" : ""}
                          >
                            {role.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/provider/jobs/${role.id}`}>
                                  <Eye className="mr-2 h-4 w-4" /> View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/provider/jobs/${role.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => console.log(`Delete job: ${role.id}`)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddRoleDialog isOpen={isAddRoleOpen} onClose={() => setIsAddRoleOpen(false)} onAddRole={handleAddRole} />
    </div>
  )
}

