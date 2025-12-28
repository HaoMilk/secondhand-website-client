import axios from 'axios'

// Interface cho dữ liệu địa chỉ Việt Nam
export interface Province {
  code: string
  name: string
}

export interface District {
  code: string
  name: string
  province_code: string
}

export interface Ward {
  code: string
  name: string
  district_code: string
}

// Sử dụng API công khai từ provinces.open-api.vn
const addressApi = axios.create({
  baseURL: 'https://provinces.open-api.vn/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const vietnamAddressApi = {
  // Lấy danh sách tất cả tỉnh/thành phố
  getProvinces: async (): Promise<Province[]> => {
    try {
      const response = await addressApi.get<Province[]>('/p/')
      return response.data
    } catch (error) {
      console.error('Error fetching provinces:', error)
      throw error
    }
  },

  // Lấy danh sách quận/huyện theo mã tỉnh/thành phố
  getDistricts: async (provinceCode: string): Promise<District[]> => {
    try {
      const response = await addressApi.get(`/p/${provinceCode}?depth=2`)
      // API trả về province object với districts bên trong
      const province = response.data as any
      if (province.districts && Array.isArray(province.districts)) {
        return province.districts.map((d: any) => ({
          code: d.code,
          name: d.name,
          province_code: provinceCode,
        }))
      }
      return []
    } catch (error) {
      console.error('Error fetching districts:', error)
      throw error
    }
  },

  // Lấy danh sách phường/xã theo mã quận/huyện
  getWards: async (districtCode: string): Promise<Ward[]> => {
    try {
      const response = await addressApi.get(`/d/${districtCode}?depth=2`)
      // API trả về district object với wards bên trong
      const district = response.data as any
      if (district.wards && Array.isArray(district.wards)) {
        return district.wards.map((w: any) => ({
          code: w.code,
          name: w.name,
          district_code: districtCode,
        }))
      }
      return []
    } catch (error) {
      console.error('Error fetching wards:', error)
      throw error
    }
  },
}

export default vietnamAddressApi

