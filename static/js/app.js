// setting url variable for samples.json
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//creating a dropdown menu based on the specific html area
let dropdownMenu = d3.select("#selDataset");

// Function to create the bar chart
function createBarChart(sample) {
  // Get the selected sample data from samples.json using d3
  d3.json(url).then(function(data) {
    let samples = data.samples;

    // Filtering the data within json file to get needed attributes
    let selectedSample = samples.find(object => object.id === sample);

    //Sorting and slicing to get the top 10 otus for each id
    let otu_ids = selectedSample.otu_ids.slice(0, 10).reverse();
    //sorting and slicing the sample_values 
    let sample_values = selectedSample.sample_values.slice(0, 10).reverse();
    //creating the hoverlabels for the data as well
    let otu_labels = selectedSample.otu_labels.slice(0, 10).reverse();

    // Creating the trace for the bar graph and including text labels and otu ids 
    let trace = {
      x: sample_values,
      y: otu_ids.map(id => `OTU ${id}`),
      text: otu_labels,
      type: 'bar',
      orientation: 'h'
    };

    // Creating the data array for the plot
    let info = [trace];

    // Define the layout for the plot
    let layout = {
      title: `Top 10 OTUs for ${sample}`,
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' },
      margin: { t: 30, l: 150 }
    };
     // Plotting the bar chart
    Plotly.newPlot('bar', info, layout);
  });
}

// Function to create the bubble chart
function createBubbleChart(sample) {
  // Get the selected sample data from samples.json
  d3.json(url).then(function(data) {
    let samples = data.samples;

    // Filter the sample data for the selected sample
    let selectedSample = samples.find(object => object.id === sample);

    // Create the trace for the bubble chart
    let trace2 = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: 'markers',
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids,
        colorscale: 'Viridis'
      }
    };

    // Create the data array for the plot
    let info = [trace2];

    // Define the layout for the plot
    let layout = {
      title: `Bubble Chart for ${sample}`,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      showlegend: false,
      height: 600,
      width: 1200
    };

    // Plot the bubble chart
    Plotly.newPlot('bubble', info, layout);
  });
}

// Function to display metadata
function displayMetadata(sample) {
  // Getting the metadata for the selected sample
  d3.json(url).then(function(data) {
    let metadata = data.metadata;
    // Filtering the metadata for the selected sample
    let selectedMetadata = metadata.find(object => object.id === parseInt(sample));
    // Select the sample-metadata div
    let metadataDiv = d3.select("#sample-metadata");
    // Clear existing metadata
    metadataDiv.html("");
    // Display each key-value pair in the metadata
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataDiv.append("p").text(`${key}: ${value}`);
    });
  });
}

// Function to handle dropdown change for all charts and metadata
function optionChanged(sample) {
  createBarChart(sample);
  createBubbleChart(sample);
  displayMetadata(sample);
}

// Using d3 library to read in the samples.json and populate the dropdown menu
d3.json(url).then(function(data) {
  console.log(data);
  // Get the names from samples.json
  let names = data.names;
  // Populating the dropdown menu
  names.forEach(function(name) {
    dropdownMenu.append("option")
      .text(name)
      .property("value", name);
  });
  // Initializing the charts and metadata with the first sample
  createBarChart(names[0]);
  createBubbleChart(names[0]);
  displayMetadata(names[0]);
});
