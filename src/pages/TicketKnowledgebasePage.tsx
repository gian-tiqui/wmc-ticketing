import { useParams } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useQuery } from "@tanstack/react-query";
import { getTicketById } from "../@utils/services/ticketService";
import {
  Activity as ActivityType,
  Comment,
  ImageLocation,
  ServiceReport,
} from "../types/types";
import {
  Clock,
  User,
  Building,
  Tag,
  AlertCircle,
  Calendar,
  FileText,
  MessageSquare,
  Activity,
  CheckCircle,
  XCircle,
  Play,
  Info,
} from "lucide-react";
import ServiceReportItem from "../components/ServiceReportItem";

const TicketKnowledgebasePage = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const numericTicketId = Number(ticketId);

  const {
    data: ticketData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`ticket`, numericTicketId, "knowledgebase"],
    queryFn: () => getTicketById(numericTicketId),
    enabled: !!numericTicketId && numericTicketId !== undefined,
  });

  if (isLoading) {
    return (
      <PageTemplate>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent rounded-full border-t-blue-600 animate-spin"></div>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Loading ticket...
            </p>
          </div>
        </div>
      </PageTemplate>
    );
  }

  if (isError) {
    return (
      <PageTemplate>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
          <div className="p-8 text-center bg-white border border-red-100 shadow-xl rounded-2xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              Error Loading Ticket
            </h3>
            <p className="text-lg text-gray-600">
              Please try again later or contact support.
            </p>
          </div>
        </div>
      </PageTemplate>
    );
  }

  const ticket = ticketData?.data?.ticket;

  if (!ticket) {
    return (
      <PageTemplate>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="p-8 text-center bg-white border border-yellow-100 shadow-xl rounded-2xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full">
              <AlertCircle className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              Ticket Not Found
            </h3>
            <p className="text-lg text-gray-600">
              The requested ticket could not be found.
            </p>
          </div>
        </div>
      </PageTemplate>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25";
      case "in progress":
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25";
      case "resolved":
        return "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25";
      case "closed":
        return "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/25";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/25";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/25";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
        return <Play className="w-4 h-4" />;
      case "in progress":
        return <Clock className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      case "closed":
        return <XCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <PageTemplate>
      <div className="h-screen overflow-auto bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Modern Header with Gradient Background */}
          <div className="relative mb-12 overflow-auto shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative p-8 lg:p-12">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                      {ticket.title}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        ticket.status?.type
                      )}`}
                    >
                      {getStatusIcon(ticket.status?.type)}
                      {ticket.status?.type || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Tag className="w-5 h-5" />
                    <span className="text-lg font-medium">
                      Ticket ID: #{ticket.id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 text-white bg-white/20 backdrop-blur-sm rounded-xl">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    Created {ticket.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Description */}
              <div className="overflow-auto transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      Description
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-lg leading-relaxed text-gray-700">
                    {ticket.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Resolution */}
              {ticket.resolution && (
                <div className="overflow-auto transition-shadow duration-300 bg-white border shadow-lg border-emerald-200 rounded-2xl hover:shadow-xl">
                  <div className="p-6 bg-gradient-to-r from-emerald-500 to-green-600">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">
                        Resolution
                      </h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {ticket.resolution}
                    </p>
                  </div>
                </div>
              )}

              {/* Service Reports */}
              {ticket.serviceReports && ticket.serviceReports.length > 0 && (
                <div className="overflow-auto transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
                  <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-600">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">
                        Service Reports
                      </h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-8 max-h-[600px] overflow-auto">
                      {ticket.serviceReports.map(
                        (serviceReport: ServiceReport) => (
                          <div
                            key={serviceReport.id}
                            className="pl-6 border-l-4 border-purple-500"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                                <User className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-gray-900">
                                  {serviceReport.serviceReporter.firstName}{" "}
                                  {serviceReport.serviceReporter.lastName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {serviceReport.createdAt}
                                </p>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                              <div className="grid gap-4">
                                {serviceReport.imageLocations.map(
                                  (imageLocation: ImageLocation) => (
                                    <ServiceReportItem
                                      key={imageLocation.id}
                                      imageLocation={imageLocation}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              {ticket.comments && ticket.comments.length > 0 && (
                <div className="overflow-auto transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
                  <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-600">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Comments</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {ticket.comments.map(
                        (comment: Comment, index: number) => (
                          <div
                            key={index}
                            className="flex gap-4 p-5 transition-colors duration-200 bg-gray-50 rounded-xl hover:bg-gray-100"
                          >
                            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  {comment.user.firstName || "Unknown"}
                                </span>
                                <span className="px-2 py-1 text-sm text-gray-500 bg-gray-200 rounded-full">
                                  {comment.createdAt}
                                </span>
                              </div>
                              <p className="leading-relaxed text-gray-700">
                                {comment.comment}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              {ticket.activities && ticket.activities.length > 0 && (
                <div className="overflow-auto transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
                  <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">
                        Activity Timeline
                      </h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {ticket.activities.map(
                        (activity: ActivityType, index: number) => (
                          <div
                            key={activity.id}
                            className="relative flex gap-4"
                          >
                            {index !== ticket.activities.length - 1 && (
                              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                            )}
                            <div className="relative z-10 flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600">
                              <i
                                className={`${activity.icon} text-white text-lg`}
                              ></i>
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  {activity.title}
                                </span>
                                <span className="px-2 py-1 text-sm text-gray-500 bg-gray-200 rounded-full">
                                  {activity.createdAt}
                                </span>
                              </div>
                              <p className="leading-relaxed text-gray-700">
                                {activity.activity}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Ticket Details */}
              <div className="overflow-auto transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
                <div className="p-6 bg-gradient-to-r from-slate-700 to-gray-800">
                  <h3 className="text-xl font-bold text-white">
                    Ticket Details
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-gray-900">
                          Issuer
                        </p>
                        <p className="text-gray-700">
                          {ticket.issuer
                            ? `${ticket.issuer.firstName} ${ticket.issuer.lastName}`
                            : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-full">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-gray-900">
                          Assigned To
                        </p>
                        <p className="text-gray-700">
                          {ticket.assignedUser
                            ? `${ticket.assignedUser.firstName} ${ticket.assignedUser.lastName}`
                            : "Unassigned"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full">
                        <Building className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-gray-900">
                          Department
                        </p>
                        <p className="text-gray-700">
                          {ticket.department?.name} ({ticket.department?.code})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full">
                        <Tag className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-gray-900">
                          Category
                        </p>
                        <p className="text-gray-700">
                          {ticket.category?.name || "Uncategorized"}
                        </p>
                      </div>
                    </div>

                    {ticket.category?.SLA && (
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-red-100 rounded-full">
                          <Clock className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="mb-1 text-sm font-semibold text-gray-900">
                            SLA
                          </p>
                          <p className="text-gray-700">
                            {ticket.category.SLA}{" "}
                            {ticket.category.SLA === 1 ? "hour" : "hours"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="overflow-auto transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
                <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
                  <h3 className="text-xl font-bold text-white">Timeline</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Created
                        </p>
                        <p className="text-gray-700">{ticket.createdAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Last Updated
                        </p>
                        <p className="text-gray-700">{ticket.updatedAt}</p>
                      </div>
                    </div>

                    {ticket.acknowledgedAt && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Acknowledged
                          </p>
                          <p className="text-gray-700">
                            {ticket.acknowledgedAt}
                          </p>
                        </div>
                      </div>
                    )}

                    {ticket.resolutionTime && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Resolution Time
                          </p>
                          <p className="text-gray-700">
                            {ticket.resolutionTime}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="overflow-auto transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-2xl hover:shadow-xl">
                <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600">
                  <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">
                      Additional Information
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-900">
                        Report Required
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          ticket.reportRequired
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ticket.reportRequired ? "Yes" : "No"}
                      </span>
                    </div>

                    {ticket.pauseReason && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="mb-1 text-sm font-semibold text-gray-900">
                          Pause Reason
                        </p>
                        <p className="text-gray-700">{ticket.pauseReason}</p>
                      </div>
                    )}

                    {ticket.closingReason && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="mb-1 text-sm font-semibold text-gray-900">
                          Closing Reason
                        </p>
                        <p className="text-gray-700">{ticket.closingReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default TicketKnowledgebasePage;
