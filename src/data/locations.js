export const INDIAN_STATES = [
  {
    name: 'Maharashtra',
    districts: [
      {
        name: 'Mumbai City',
        cities: ['Mumbai', 'Colaba', 'Dadar', 'Worli']
      },
      {
        name: 'Mumbai Suburban',
        cities: ['Andheri', 'Bandra', 'Borivali', 'Goregaon', 'Kurla']
      },
      {
        name: 'Pune',
        cities: ['Pune', 'Pimpri-Chinchwad', 'Hinjawadi', 'Lonavala']
      }
    ]
  },
  {
    name: 'Karnataka',
    districts: [
      {
        name: 'Bengaluru Urban',
        cities: ['Bengaluru', 'Whitefield', 'Koramangala', 'Indiranagar']
      },
      {
        name: 'Mysuru',
        cities: ['Mysuru', 'Nanjangud', 'Hunsur']
      }
    ]
  },
  {
    name: 'Delhi',
    districts: [
      {
        name: 'New Delhi',
        cities: ['Connaught Place', 'Chanakyapuri', 'Vasant Vihar']
      },
      {
        name: 'South Delhi',
        cities: ['Hauz Khas', 'Saket', 'Greater Kailash']
      }
    ]
  },
  {
    name: 'Uttar Pradesh',
    districts: [
      {
        name: 'Gautam Buddha Nagar',
        cities: ['Noida', 'Greater Noida']
      },
      {
        name: 'Lucknow',
        cities: ['Lucknow', 'Gomti Nagar', 'Alambagh']
      }
    ]
  }
];

// Helper to get districts for a state
export const getDistricts = (stateName) => {
  const state = INDIAN_STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase());
  return state ? state.districts : [];
};

// Helper to get cities for a district
export const getCities = (stateName, districtName) => {
  const districts = getDistricts(stateName);
  const district = districts.find(d => d.name.toLowerCase() === districtName.toLowerCase());
  return district ? district.cities : [];
};
