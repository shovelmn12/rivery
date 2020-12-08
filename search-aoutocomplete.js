/*An array containing all the names*/
const integrations = ["Adaptive Insights","AdapTV","adjust","Adobe Ads","Adobe Analytics","Adquant","Adroll","Airtable","Amplitude","Anaplan","App Store Connect – Analytics","App Store Connect – Sales","Apple Search Ads","AppNexus","Appreciate","Appsee","AppsFlyer","Avantlink","Bing Ads","BlueSnap","Brandwatch","Cassandra","Cedato","Chargify","Convert Media","CouchBase","Crimson Hexagon","Criteo","Currency Service","Customer Gauge","Delta Projects","Display & Video 360","Docebo","DoubleClick","DoubleVerify","Facebook Ads","Facebook Audience Network","Facebook Social","FTP","GMP365","Google Ad Manager","Google Ads","Google AdWords","Google Analytics","Google Data Store","Google Email","Google Play","Google Sheets","Gothamads","Greenhouse","Harvest","HasOffers","HelpScout","Hubspot","Impact Radius","Index Exchange Client Audit Logs","Innovid","Insight Squared","Instagram","Intacct","Intercom","Jira","JW Player","JW Player Analytics","Keepcon","Klaviyo","Kochava","Linkedin Ads","Linkedin Social","LKQD","Magento","Magnetic","Mailchimp","Mandrill","Marketo","MediaMath","Mixpanel","Moat Analytics","Mobile Action","MongoDB","MS SQL Server","MyAffiliates","MySQL","Netbase","Netsuite","Nuviad","Oath","Oracle","Outbrain","Pardot by Salesforce","Picasso Labs","Pinterest Ads","Pipedrive","PostgreSQL","Recurly","Redis","Rest","Revcontent","Salesforce","Salesforce Audience Studio (DMP)","Salesforce Desk","Search Ads 360","Segment","Sendgrid","SensorTower","ServiceNow","SFTP (Secure FTP)","ShareASale","ShipHero","Shopify","Slack","Snapchat Ads","Social Studio by Salesforce","Socialbakers","SpotX","Sprinklr","StreamRail","Stripe","Survey Gizmo","SurveyMonkey","Taboola","The Trade Desk","Tiger Pistol","Trendkite","Twitter Ads","VertaMedia","Voluum","Webhook","Yahoo Gemini","Yotpo","YouTube Reporting","Zendesk","Zendesk Chat","Zendesk Talk","Amazon Redshift","Amazon S3","Azure Blob Storage","Azure Data Lake Analytics","Azure SQL Data Warehouse","Google BigQuery","Google Cloud Storage","Snowflake","Treasure Data"];
    
const fuse = new Fuse(integrations, { includeMatches: true })

window.addEventListener('load', function () {

    function createItemTile(value, indices) {
      return `${indices.reduce(
            (acc, [s, e]) => `${acc}<strong>${value.substring(s, e + 1)}</strong>`,
            value.substring(0, indices[0][0])
          )}${value.substring(indices[indices.length - 1][1] + 1)}`;
    }

    function addItemTile(parent, onClick, value, indices) {
      /*create a DIV element for each matching element:*/
      const b = document.createElement("DIV");
      b.setAttribute("class", "autocomplete-item");

      /*make the matching letters bold:*/
      b.innerHTML = createItemTile(value, indices);

      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value='" + value + "'>";
      /*execute a function when someone clicks on the item value (DIV element):*/
      b.addEventListener("click", onClick);
      
      parent.appendChild(b);
    }

    function autocomplete(inp, arr) {
      /*the autocomplete function takes two arguments,
      the text field element and an array of possible autocompleted values:*/
      var currentFocus;

      function onItemTileClick() {
        /*insert the value for the autocomplete text field:*/
        inp.value = this.getElementsByTagName("input")[0].value;
        $('#search').click();
        /*close the list of autocompleted values,
        (or any other open lists of autocompleted values:*/
        closeAllLists();
      }

      /*execute a function when someone writes in the text field:*/
      inp.addEventListener("input", function(e) {
            $('#result-box').hide();
          const val = this.value;
          /*close any already open lists of autocompleted values*/
          /*close any already open lists of autocompleted values*/
          closeAllLists();
          if (!val) { return false;}
          currentFocus = -1;
          /*create a DIV element that will contain the items (values):*/
          const a = document.createElement("DIV");
          a.style.visibility = 'hidden';   
          a.setAttribute("id", this.id + "autocomplete-list");
          a.setAttribute("class", "autocomplete-items");
          /*append the DIV element as a child of the autocomplete container:*/
          this.parentNode.appendChild(a);

          /*search for matches*/
          const results = fuse.search(val);

          if (results.find((result) => result.item === val) === undefined && integrations.find((item) => item === val) === undefined) {
            addItemTile(a, onItemTileClick, val, [[0, val.length]]);
          }

          /*for each item in the array...*/
          for (const result of results) {
            addItemTile(a, onItemTileClick, result.item, result.matches[0].indices);
          }

          if(a.hasChildNodes()) {
            a.style.visibility = 'visible';
          } else {
            a.style.visibility = 'hidden';
          }
      });
      /*execute a function presses a key on the keyboard:*/
      inp.addEventListener("keydown", function(e) {
          var x = document.getElementById(this.id + "autocomplete-list");
          if (x) x = x.getElementsByTagName("div");
          if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
          } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
              /*and simulate a click on the "active" item:*/
              if (x) x[currentFocus].click();
            }
          }
      });
      function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
      }
      function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
        }
      }
      function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
            x[i].parentNode.removeChild(x[i]);
          }
        }
      }

      /*execute a function when someone clicks in the document:*/
      document.addEventListener("click", function (e) {
          closeAllLists(e.target);
      });

      closeAllLists();
    }
    
    /*initiate the autocomplete function on the "myInput" element, and pass along the integrations array as possible autocomplete values:*/
    autocomplete(document.getElementById("my-input"), integrations);

    //When search clicked
    $('#search').click(function(){
        $('#result-flase').hide();
        $('#result-true').show();
        let logoSlug;
        let logoUrl;
        switch ($('#my-input').val()) {
            case "App Store Connect – Analytics":
                logoSlug = "appstore_apps";
              break;
            case "App Store Connect – Sales":
                logoSlug = "itunes_reporter";
              break;
            case "Apple Search Ads":
                logoSlug = "appleads";
              break;
            case "Currency Service":
                logoSlug = "ecb";
              break;
            case "Display & Video 360":
                logoSlug = "dv360";
              break;
            case "Facebook Ads":
                logoSlug = "fb_ads";
              break;
            case "Facebook Audience Network":
                logoSlug = "fb_audience";
              break;
            case "Facebook Social":
                logoSlug = "fb_social";
              break;
            case "GMP365":
                logoSlug = "gmp";
              break;
            case "Google Ad Manager":
                logoSlug = "doubleclick_publisher";
              break;
            case "Google AdWords":
                logoSlug = "gadwords";
              break;
            case "Google Analytics":
                logoSlug = "ganalytics";
              break;
              case "Google Data Store":
                logoSlug = "datastore";
              break;
            case "Google Email":
                logoSlug = "email";
              break;
            case "Google Play":
                logoSlug = "gplay";
              break;
            case "Google Sheets":
                logoSlug = "gspreadsheet";
              break;
            case "Index Exchange Client Audit Logs":
                logoSlug = "ix_audit_logs";
              break;
            case "Insight Squared":
                logoSlug = "insight";
              break;
            case "Instagram":
                logoSlug = "instagram_social";
              break;
            case "Linkedin Ads":
                logoSlug = "linkedin";
              break;
            case "Moat Analytics":
                logoSlug = "moat";
              break;
            case "MS SQL Server":
                logoSlug = "mssql";
              break;
            case "Pardot by Salesforce":
                logoSlug = "sf-pardot";
              break;
            case "Salesforce Audience Studio (DMP)":
                logoSlug = "salesforce_audience";
              break;
              case "Google Sheets":
                logoSlug = "gspreadsheet";
              break;
            case "Salesforce Desk":
                logoSlug = "desk";
              break;
            case "Search Ads 360":
                logoSlug = "sa360";
              break;
            case "SFTP (Secure FTP)":
                logoSlug = "sftp";
              break;
            case "Social Studio by Salesforce":
                logoSlug = "social_studio";
              break;
            case "VertaMedia":
                logoSlug = "verta_media";
              break;
            case "Amazon Redshift":
                logoSlug = "redshift";
              break;
            case "Amazon S3":
                logoSlug = "s3";
              break;
            case "Azure Blob Storage":
                logoSlug = "azureblob";
              break;
            case "Azure Data Lake Analytics":
                logoSlug = "azure-data-lake";
              break;
            case "Google BigQuery":
                logoSlug = "bq";
              break;
            case "Google Cloud Storage":
                logoSlug = "gcs";
              break;
            default:
                logoSlug = $('#my-input').val().replace(/\s+/g, '_').toLowerCase();
          }
          if ($('#my-input').val()=="Azure SQL Data Warehouse") {
              logoUrl = "https://i.pinimg.com/originals/7a/ba/cc/7abaccd7f9ec9e59a170a13380e0448d.png";
          } else if ($('#my-input').val()=="Treasure Data") {
              logoUrl = "https://www.treasuredata.com/logos/arm-treasure-data-logo-stacked.jpg";
          } else {
              logoUrl = "https://rivery.io/wp-content/themes/Vela-Child-Theme/images/integrations/"+logoSlug+".png";
          }
      if(["Amazon Redshift","Amazon S3","Azure Blob Storage","Azure Data Lake Analytics","Azure SQL Data Warehouse","Google BigQuery","Google Cloud Storage","Snowflake","Treasure Data"].indexOf($('#my-input').val()) !== -1) {
        $('#result-text').text("Easily load all your data into " + $('#my-input').val() + " in a matter of clicks and build no-code data pipelines at scale with Rivery’s SaaS ETL platform.");
        $("#logo-image").attr("src",logoUrl);
        var tmpImg = new Image() ;
        tmpImg.src = $('#logo-image').attr('src') ;
        tmpImg.onload = function() {
          $('#result-box').show();
        } ;
      } else if(integrations.indexOf($('#my-input').val()) !== -1) {
        $('#result-text').text("Whether you’re using Snowflake, Google, Amazon, Microsoft, or other common targets, easily integrate your data from " + $('#my-input').val() + " in a matter of clicks. ");
        $("#logo-image").attr("src",logoUrl);
        var tmpImg = new Image() ;
        tmpImg.src = $('#logo-image').attr('src') ;
        tmpImg.onload = function() {
          $('#result-box').show();
        } ;
      } else if($('#my-input').val() !== "") {
        $('#result-flase').show();
        $('#result-true').hide();
        $('#result-box').show();
      }
    })

    //when result box x clicked
    $('#result-x').click(function(){
      $('#result-box').hide();
    })
  })