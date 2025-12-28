export interface Address {
  province: string;
  district: string;
  ward: string;
  street?: string;
}

export interface ProfileBasicInfo {
  fullName?: string;
  phone?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  avatar?: string;
  address?: Address;
}

export interface ShippingAddress {
  _id?: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street?: string;
  note?: string;
  isDefaultShipping?: boolean; // Địa chỉ mặc định cho giao hàng
  isDefaultPickup?: boolean; // Địa chỉ mặc định cho lấy hàng
}

export interface ContactMethods {
  internalChat?: boolean;
  phone?: boolean;
  showPhone?: boolean;
}

export interface PaymentMethods {
  eWallet?: boolean;
  bankTransfer?: boolean;
  bankAccount?: string;
}

export interface SellerAgreements {
  termsAccepted?: boolean;
  noProhibitedItems?: boolean;
}

export interface SellerInfo {
  shopName?: string;
  tradingArea?: string;
  pickupAddressId?: string; // ID của địa chỉ lấy hàng từ sổ địa chỉ
  contactMethods?: ContactMethods;
  paymentMethods?: PaymentMethods;
  agreements?: SellerAgreements;
}

export interface ProfileResponse {
  profile: ProfileBasicInfo;
  shippingAddresses: ShippingAddress[];
  sellerInfo: SellerInfo;
  completion: {
    percentage: number;
    missingFields: string[];
  };
}

export interface ProfileCheckResult {
  canSell?: boolean;
  canBuy?: boolean;
  reason?: string;
  missingFields?: string[];
}

