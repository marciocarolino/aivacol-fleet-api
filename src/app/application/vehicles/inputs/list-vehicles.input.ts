export interface ListVehiclesInput {
  page?: number;
  limit?: number;
  licensePlate?: string;
  chassis?: string;
  renavam?: string;
  year?: number;
  modelId?: string;
}
