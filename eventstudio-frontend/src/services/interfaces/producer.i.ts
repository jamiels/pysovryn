export interface IProducer {
  id: number;
  name: string;
  space_id: number;
  created_at: string;
  updated_at: string;
}

export interface IProducerRequest {
  name: string;
  space_id: number;
}

export interface IProducerUpdateRequest {
  name: string;
  space_id: number;
}
