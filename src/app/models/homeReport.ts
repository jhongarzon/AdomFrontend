import { ServiceChartStatus } from "./serviceChartStatus";
import { PatientReportData } from "./patientReportData";
import { ProfessionalCopaymentReport } from "./professionalCopaymentReport";

export class HomeReport {
    nursingStatuses: ServiceChartStatus[];
    therapyStatuses :ServiceChartStatus[];
    patientsWithoutProfessional :PatientReportData[];
    irreglularServices :PatientReportData[];
    professionalCopayments :ProfessionalCopaymentReport[];
}