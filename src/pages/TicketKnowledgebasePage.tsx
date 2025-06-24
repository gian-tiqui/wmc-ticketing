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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        </div>
      </PageTemplate>
    );
  }

  if (isError) {
    return (
      <PageTemplate>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Error Loading Ticket
            </h3>
            <p className="text-gray-600">
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Ticket Not Found
            </h3>
            <p className="text-gray-600">
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
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
      <div className="h-screen px-4 py-8 mx-auto overflow-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {ticket.title}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    ticket.status?.type
                  )}`}
                >
                  {getStatusIcon(ticket.status?.type)}
                  {ticket.status?.type || "Unknown"}
                </span>
              </div>
              <p className="text-gray-600">Ticket ID: #{ticket.id}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Created {ticket.createdAt}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Description
                </h2>
              </div>
              <div className="prose-sm prose max-w-none">
                <p className="leading-relaxed text-gray-700">
                  {ticket.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Resolution */}
            {ticket.resolution && (
              <div className="p-6 border border-green-200 shadow-sm bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                  <h2 className="text-lg font-semibold text-green-900">
                    Resolution
                  </h2>
                </div>
                <div className="prose-sm prose max-w-none">
                  <p className="leading-relaxed text-green-800">
                    {ticket.resolution}
                  </p>
                </div>
              </div>
            )}

            {/* Service Reports */}
            {ticket.serviceReports && ticket.serviceReports.length > 0 && (
              <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Service Reports
                  </h2>
                </div>
                <div className="space-y-6 max-h-[500px] overflow-auto pr-2">
                  {ticket.serviceReports.map((serviceReport: ServiceReport) => (
                    <div key={serviceReport.id} className="mb-6">
                      <p className="text-base font-medium text-gray-800">
                        {serviceReport.serviceReporter.firstName}{" "}
                        {serviceReport.serviceReporter.lastName}'s Service
                        Report
                      </p>
                      <p className="mb-2 text-sm text-gray-400">
                        {serviceReport.createdAt}
                      </p>
                      <div className="grid gap-3 p-3 overflow-x-auto bg-white border rounded shadow-inner">
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
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            {ticket.comments && ticket.comments.length > 0 && (
              <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Comments
                  </h2>
                </div>
                <div className="space-y-4">
                  {ticket.comments.map((comment: Comment, index: number) => (
                    <div
                      key={index}
                      className="flex gap-3 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.user.firstName || "Unknown"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {comment.createdAt}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            {ticket.activities && ticket.activities.length > 0 && (
              <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Activity Timeline
                  </h2>
                </div>
                <div className="space-y-4">
                  {ticket.activities.map((activity: ActivityType) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                        <i
                          className={`${activity.icon} text-blue-600 text-sm`}
                        ></i>
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {activity.title}
                          </span>
                          <span className="text-sm text-gray-500">
                            {activity.createdAt}
                          </span>
                        </div>
                        <p className="text-gray-700">{activity.activity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Details */}
            <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Ticket Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Issuer</p>
                    <p className="text-sm text-gray-600">
                      {ticket.issuer
                        ? `${ticket.issuer.firstName} ${ticket.issuer.lastName}`
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Assigned To
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.assignedUser
                        ? `${ticket.assignedUser.firstName} ${ticket.assignedUser.lastName}`
                        : "Unassigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Department
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.department?.name} ({ticket.department?.code})
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Category
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.category?.name || "Uncategorized"}
                    </p>
                  </div>
                </div>

                {ticket.category?.SLA && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">SLA</p>
                      <p className="text-sm text-gray-600">
                        {ticket.category.SLA}{" "}
                        {ticket.category.SLA === 1 ? "hour" : "hours"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Timeline
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Created</p>
                  <p className="text-sm text-gray-600">{ticket.createdAt}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Last Updated
                  </p>
                  <p className="text-sm text-gray-600">{ticket.updatedAt}</p>
                </div>

                {ticket.acknowledgedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Acknowledged
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.acknowledgedAt}
                    </p>
                  </div>
                )}

                {ticket.resolutionTime && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Resolution Time
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.resolutionTime}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="p-6 bg-[#EEEEEE] border border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Additional Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Report Required</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.reportRequired
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ticket.reportRequired ? "Yes" : "No"}
                  </span>
                </div>

                {ticket.pauseReason && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Pause Reason
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.pauseReason}
                    </p>
                  </div>
                )}

                {ticket.closingReason && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Closing Reason
                    </p>
                    <p className="text-sm text-gray-600">
                      {ticket.closingReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default TicketKnowledgebasePage;
