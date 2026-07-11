export default {
  // Visual comparison service provider ("percy" or "playwright")
  provider: 'percy',
  
  // Framework integration type ("auto", "react", "next", "vue", "angular", "svelte")
  framework: 'auto',
  
  // Enable cache for incremental testing
  cache: true,
  
  // Workers number ("auto" or custom number)
  workers: 'auto',
  
  // Reports options
  report: {
    html: true,
    json: true
  },
  
  // Mask dynamic elements (dates, uuids, times)
  dynamicDetection: true
};
