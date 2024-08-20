<template>
  <div>
    <!-- Modal Component -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Add New Country</h2>
        <form @submit.prevent="addCountry">
          <label for="country-name">Country Name:</label>&nbsp;
          <input type="text" v-model="newCountry.name" id="country-name" required @blur="validateCountryName">
          <span v-if="nameError" class="error">{{ nameError }}</span>
          <br/><br/>
          <label for="country-continent">Select Continent:</label>&nbsp;
          <select v-model="newCountry.continent">
            <option v-for="cont in uniqueContinent" :key="cont.id" :value="cont.continent">
              {{ cont.continent }}
            </option>
          </select>
          <br/><br/>
          <label for="country-rank">Country Rank:</label>&nbsp;
          <input type="number" v-model="newCountry.rank" id="country-rank" required>
          <br/><br/>
          <label for="country-flag">Country Flag:</label>&nbsp;
          <input type="file" @change="handleFileUpload" id="country-flag" accept=".jpg, .png" required>
          <span v-if="uploadError" class="error">{{ uploadError }}</span>
          <br/><br/>
          <button type="submit" :disabled="formInvalid">Add Country</button>
          <button type="button" @click="showModal = false">Cancel</button>
        </form>
      </div>
    </div>
    <div class="Main" v-if="!showModal">
      <button @click="showModal = true">Add New Country</button>
      <h1>Countries List</h1>
      <select v-model="selectedCountry" @change="fetchCountryDetails">
        <option v-for="country in countries" :key="country.rank" :value="country.rank">
          {{ country.name }}
        </option>
      </select>

      <div v-if="selectedCountryDetails">
        <h2>Details of Selected Country</h2>
        <p><strong>Name:</strong> {{ selectedCountryDetails.name }}</p>
        <p><strong>Continent:</strong> {{ selectedCountryDetails.continent }}</p>
        <p><strong>Rank:</strong> {{ selectedCountryDetails.rank }}</p>
        <img :src="`/api/${selectedCountryDetails.flag}`" alt="Country Image" v-if="selectedCountryDetails.flag" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      countries: [],
      selectedCountry: null, 
      selectedCountryDetails: null, 
      showModal: false,
      newCountry: { 
        name: '',
        rank: '',
        flag: null,
        flagName: ''
      },
      file: null,
      uniqueContinent: [],
      nameError: null,
      uploadError: null, 
    };
  },
  computed: {
    formInvalid() {
      return this.nameError || this.uploadError || !this.newCountry.name || !this.newCountry.rank || !this.newCountry.flag;
    }
  },
  mounted() {
    axios.get('/api/countries')
      .then(response => {
        let responseData = response.data;
        this.countries = responseData.countries;
        this.uniqueContinent = responseData.uniqueContinent;
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  },
  methods: {
    validateCountryName() {
      const nameLength = this.newCountry.name.length;
      if (nameLength < 3) {
        this.nameError = 'Country name must be at least 3 characters long.';
      } else if (nameLength > 20) {
        this.nameError = 'Country name cannot exceed 20 characters.';
      } else {
        this.nameError = null;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      
      // Reset upload error
      this.uploadError = null;

      if (file) {
        if (file.size > 4 * 1024 * 1024) { // Check if file is larger than 4MB
          this.uploadError = 'File size must be less than 4MB.';
          this.newCountry.flag = null;
        } else if (!['image/jpeg', 'image/png'].includes(file.type)) { // Check if file is JPG or PNG
          this.uploadError = 'Only JPG and PNG files are allowed.';
          this.newCountry.flag = null;
        } else {
          // Store the file for upload
          this.newCountry.flag = file;
          this.newCountry.flagName = file.name;
        }
      }
    },
    async addCountry() {
      // Validate before sending data
      this.validateCountryName();
      if (this.formInvalid) {
        return;
      }
      
      const formData = new FormData();
      formData.append('image', this.newCountry.flag);
      formData.append('name', this.newCountry.name);
      formData.append('rank', this.newCountry.rank);
      formData.append('continent', this.newCountry.continent);
      try {
        const response = await axios.post('/api/countries', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        console.log('Data uploaded successfully:', response.data);
        this.showModal = false; // Close the modal
        this.newCountry = { name: '', rank: '', flag: null }; 
        this.countries.push(response.data)
      } catch (error) {
        console.error('Error uploading data:', error);
      }
    },
    fetchCountryDetails() {
      const country = this.countries.find(c => c.rank === this.selectedCountry);

      if (country) {
        // Fetch details for the selected country
        axios.get(`/api/countries/${this.selectedCountry}`)
          .then(response => {
            this.selectedCountryDetails = response.data;
          })
          .catch(error => {
            console.error('Error fetching country details:', error);
          });
      } else {
        this.selectedCountryDetails = null;
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.875rem;
}
</style>
