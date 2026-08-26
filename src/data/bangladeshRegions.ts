export interface RegionCoords {
  lat: number;
  lng: number;
  zoom: number;
}

export interface DistrictInfo {
  name: string;
  bnName: string;
  coords: RegionCoords;
}

export interface DivisionInfo {
  name: string;
  bnName: string;
  coords: RegionCoords;
  districts: DistrictInfo[];
}

export class BD_REGIONS {
  static divisions: DivisionInfo[] = [
    {
      name: 'Dhaka',
      bnName: 'ঢাকা বিভাগ',
      coords: { lat: 23.8103, lng: 90.4125, zoom: 10 },
      districts: [
        { name: 'All Districts (Dhaka)', bnName: 'সকল জেলা (ঢাকা)', coords: { lat: 23.8103, lng: 90.4125, zoom: 10 } },
        { name: 'Dhaka', bnName: 'ঢাকা', coords: { lat: 23.8103, lng: 90.4125, zoom: 12 } },
        { name: 'Gazipur', bnName: 'গাজীপুর', coords: { lat: 23.9999, lng: 90.4203, zoom: 12 } },
        { name: 'Narayanganj', bnName: 'নারায়ণগঞ্জ', coords: { lat: 23.6238, lng: 90.5000, zoom: 12 } },
        { name: 'Tangail', bnName: 'টাঙ্গাইল', coords: { lat: 24.2513, lng: 89.9167, zoom: 12 } },
        { name: 'Narsingdi', bnName: 'নরসিংদী', coords: { lat: 23.9193, lng: 90.7206, zoom: 12 } },
        { name: 'Manikganj', bnName: 'মানিকগঞ্জ', coords: { lat: 23.8644, lng: 90.0047, zoom: 12 } },
        { name: 'Munshiganj', bnName: 'মুন্সীগঞ্জ', coords: { lat: 23.5422, lng: 90.5305, zoom: 12 } },
        { name: 'Faridpur', bnName: 'ফরিদপুর', coords: { lat: 23.6070, lng: 89.8429, zoom: 12 } },
        { name: 'Madaripur', bnName: 'মাদারীপুর', coords: { lat: 23.1641, lng: 90.1897, zoom: 12 } },
        { name: 'Gopalganj', bnName: 'গোপালগঞ্জ', coords: { lat: 23.0051, lng: 89.8266, zoom: 12 } },
        { name: 'Rajbari', bnName: 'রাজবাড়ী', coords: { lat: 23.7574, lng: 89.6444, zoom: 12 } },
        { name: 'Shariatpur', bnName: 'শরীয়তপুর', coords: { lat: 23.2423, lng: 90.4348, zoom: 12 } },
      ],
    },
    {
      name: 'Chittagong',
      bnName: 'চট্টগ্রাম বিভাগ',
      coords: { lat: 22.3569, lng: 91.7832, zoom: 10 },
      districts: [
        { name: 'All Districts (Chittagong)', bnName: 'সকল জেলা (চট্টগ্রাম)', coords: { lat: 22.3569, lng: 91.7832, zoom: 10 } },
        { name: 'Chattogram', bnName: 'চট্টগ্রাম', coords: { lat: 22.3569, lng: 91.7832, zoom: 12 } },
        { name: "Cox's Bazar", bnName: 'কক্সবাজার', coords: { lat: 21.4272, lng: 92.0058, zoom: 12 } },
        { name: 'Cumilla', bnName: 'কুমিল্লা', coords: { lat: 23.4607, lng: 91.1809, zoom: 12 } },
        { name: 'Noakhali', bnName: 'নোয়াখালী', coords: { lat: 22.8696, lng: 91.0994, zoom: 12 } },
        { name: 'Feni', bnName: 'ফেনী', coords: { lat: 23.0159, lng: 91.3976, zoom: 12 } },
        { name: 'Brahmanbaria', bnName: 'ব্রাহ্মণবাড়িয়া', coords: { lat: 23.9571, lng: 91.1119, zoom: 12 } },
        { name: 'Chandpur', bnName: 'চাঁদপুর', coords: { lat: 23.2333, lng: 90.6667, zoom: 12 } },
        { name: 'Lakshmipur', bnName: 'লক্ষ্মীপুর', coords: { lat: 22.9447, lng: 90.8282, zoom: 12 } },
        { name: 'Bandarban', bnName: 'বান্দরবান', coords: { lat: 22.1956, lng: 92.2184, zoom: 12 } },
        { name: 'Rangamati', bnName: 'রাঙ্গামাটি', coords: { lat: 22.6533, lng: 92.1753, zoom: 12 } },
        { name: 'Khagrachhari', bnName: 'খাগড়াছড়ি', coords: { lat: 23.1193, lng: 91.9847, zoom: 12 } },
      ],
    },
    {
      name: 'Sylhet',
      bnName: 'সিলেট বিভাগ',
      coords: { lat: 24.8949, lng: 91.8687, zoom: 10 },
      districts: [
        { name: 'All Districts (Sylhet)', bnName: 'সকল জেলা (সিলেট)', coords: { lat: 24.8949, lng: 91.8687, zoom: 10 } },
        { name: 'Sylhet', bnName: 'সিলেট', coords: { lat: 24.8949, lng: 91.8687, zoom: 12 } },
        { name: 'Moulvibazar', bnName: 'মৌলভীবাজার', coords: { lat: 24.4829, lng: 91.7774, zoom: 12 } },
        { name: 'Habiganj', bnName: 'হবিগঞ্জ', coords: { lat: 24.3749, lng: 91.4155, zoom: 12 } },
        { name: 'Sunamganj', bnName: 'সুনামগঞ্জ', coords: { lat: 25.0658, lng: 91.4073, zoom: 12 } },
      ],
    },
    {
      name: 'Rajshahi',
      bnName: 'রাজশাহী বিভাগ',
      coords: { lat: 24.3745, lng: 88.6042, zoom: 10 },
      districts: [
        { name: 'All Districts (Rajshahi)', bnName: 'সকল জেলা (রাজশাহী)', coords: { lat: 24.3745, lng: 88.6042, zoom: 10 } },
        { name: 'Rajshahi', bnName: 'রাজশাহী', coords: { lat: 24.3745, lng: 88.6042, zoom: 12 } },
        { name: 'Bogura', bnName: 'বগুড়া', coords: { lat: 24.8481, lng: 89.3730, zoom: 12 } },
        { name: 'Pabna', bnName: 'পাবনা', coords: { lat: 24.0104, lng: 89.2568, zoom: 12 } },
        { name: 'Sirajganj', bnName: 'সিরাজগঞ্জ', coords: { lat: 24.4534, lng: 89.7008, zoom: 12 } },
        { name: 'Naogaon', bnName: 'নওগাঁ', coords: { lat: 24.8103, lng: 88.9414, zoom: 12 } },
        { name: 'Natore', bnName: 'নাটোর', coords: { lat: 24.4102, lng: 89.0076, zoom: 12 } },
        { name: 'Chapai Nawabganj', bnName: 'চাঁপাইনবাবগঞ্জ', coords: { lat: 24.5965, lng: 88.2775, zoom: 12 } },
        { name: 'Joypurhat', bnName: 'জয়পুরহাট', coords: { lat: 25.1017, lng: 89.0270, zoom: 12 } },
      ],
    },
    {
      name: 'Khulna',
      bnName: 'খুলনা বিভাগ',
      coords: { lat: 22.8456, lng: 89.5403, zoom: 10 },
      districts: [
        { name: 'All Districts (Khulna)', bnName: 'সকল জেলা (খুলনা)', coords: { lat: 22.8456, lng: 89.5403, zoom: 10 } },
        { name: 'Khulna', bnName: 'খুলনা', coords: { lat: 22.8456, lng: 89.5403, zoom: 12 } },
        { name: 'Jeshore', bnName: 'যশোর', coords: { lat: 23.1664, lng: 89.2081, zoom: 12 } },
        { name: 'Kushtia', bnName: 'কুষ্টিয়া', coords: { lat: 23.9013, lng: 89.1204, zoom: 12 } },
        { name: 'Satkhira', bnName: 'সাতক্ষীরা', coords: { lat: 22.7185, lng: 89.0705, zoom: 12 } },
        { name: 'Bagerhat', bnName: 'বাগেরহাট', coords: { lat: 22.6516, lng: 89.7859, zoom: 12 } },
        { name: 'Jhenaidah', bnName: 'ঝিনাইদহ', coords: { lat: 23.5448, lng: 89.1539, zoom: 12 } },
        { name: 'Chuadanga', bnName: 'চুয়াডাঙ্গা', coords: { lat: 23.6402, lng: 88.8418, zoom: 12 } },
        { name: 'Narail', bnName: 'নড়াইল', coords: { lat: 23.1725, lng: 89.5127, zoom: 12 } },
        { name: 'Magura', bnName: 'মাগুরা', coords: { lat: 23.4873, lng: 89.4199, zoom: 12 } },
        { name: 'Meherpur', bnName: 'মেহেরপুর', coords: { lat: 23.7622, lng: 88.6318, zoom: 12 } },
      ],
    },
    {
      name: 'Barisal',
      bnName: 'বরিশাল বিভাগ',
      coords: { lat: 22.7010, lng: 90.3535, zoom: 10 },
      districts: [
        { name: 'All Districts (Barisal)', bnName: 'সকল জেলা (বরিশাল)', coords: { lat: 22.7010, lng: 90.3535, zoom: 10 } },
        { name: 'Barishal', bnName: 'বরিশাল', coords: { lat: 22.7010, lng: 90.3535, zoom: 12 } },
        { name: 'Bhola', bnName: 'ভোলা', coords: { lat: 22.6859, lng: 90.6482, zoom: 12 } },
        { name: 'Patuakhali', bnName: 'পটুয়াখালী', coords: { lat: 22.3596, lng: 90.3298, zoom: 12 } },
        { name: 'Pirojpur', bnName: 'পিরোজপুর', coords: { lat: 22.5841, lng: 89.9720, zoom: 12 } },
        { name: 'Barguna', bnName: 'বরগুনা', coords: { lat: 22.1558, lng: 90.1268, zoom: 12 } },
        { name: 'Jhalokathi', bnName: 'ঝালকাঠি', coords: { lat: 22.6406, lng: 90.1987, zoom: 12 } },
      ],
    },
    {
      name: 'Rangpur',
      bnName: 'রংপুর বিভাগ',
      coords: { lat: 25.7439, lng: 89.2752, zoom: 10 },
      districts: [
        { name: 'All Districts (Rangpur)', bnName: 'সকল জেলা (রংপুর)', coords: { lat: 25.7439, lng: 89.2752, zoom: 10 } },
        { name: 'Rangpur', bnName: 'রংপুর', coords: { lat: 25.7439, lng: 89.2752, zoom: 12 } },
        { name: 'Dinajpur', bnName: 'দিনাজপুর', coords: { lat: 25.6217, lng: 88.6355, zoom: 12 } },
        { name: 'Gaibandha', bnName: 'গাইবান্ধা', coords: { lat: 25.3288, lng: 89.5403, zoom: 12 } },
        { name: 'Kurigram', bnName: 'কুড়িগ্রাম', coords: { lat: 25.8054, lng: 89.6361, zoom: 12 } },
        { name: 'Nilphamari', bnName: 'নীলফামারী', coords: { lat: 25.9318, lng: 88.8560, zoom: 12 } },
        { name: 'Panchagarh', bnName: 'পঞ্চগড়', coords: { lat: 26.3411, lng: 88.5542, zoom: 12 } },
        { name: 'Thakurgaon', bnName: 'ঠাকুরগাঁও', coords: { lat: 26.0337, lng: 88.4617, zoom: 12 } },
        { name: 'Lalmonirhat', bnName: 'লালমনিরহাট', coords: { lat: 25.9165, lng: 89.4532, zoom: 12 } },
      ],
    },
    {
      name: 'Mymensingh',
      bnName: 'ময়মনসিংহ বিভাগ',
      coords: { lat: 24.7471, lng: 90.4203, zoom: 10 },
      districts: [
        { name: 'All Districts (Mymensingh)', bnName: 'সকল জেলা (ময়মনসিংহ)', coords: { lat: 24.7471, lng: 90.4203, zoom: 10 } },
        { name: 'Mymensingh', bnName: 'ময়মনসিংহ', coords: { lat: 24.7471, lng: 90.4203, zoom: 12 } },
        { name: 'Jamalpur', bnName: 'জামালপুর', coords: { lat: 24.9375, lng: 89.9377, zoom: 12 } },
        { name: 'Netrokona', bnName: 'নেত্রকোণা', coords: { lat: 24.8800, lng: 90.7275, zoom: 12 } },
        { name: 'Sherpur', bnName: 'শেরপুর', coords: { lat: 25.0205, lng: 90.0153, zoom: 12 } },
      ],
    },
  ];
}
