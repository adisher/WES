// If this returns false or the card fields aren't visible, see Step #1.
if (paypal.HostedFields.isEligible()) {
  let orderId;
  let enrolled_courses;
  let sess_id;
  let company_id;
  // function getQueryVariable(variable)
  // {
  //       var query = window.location.search.substring(1);
  //       var vars = query.split("&");
  //       for (var i=0;i<vars.length;i++) {
  //               var pair = vars[i].split("=");
  //               if(pair[0] == variable){return pair[1];}
  //       }
  //       return(false);
  // }

  // sess_id = getQueryVariable("id");

  var src = document.getElementById("script_id").src;
  sess_id = src.split("id=")[1];
  console.log("id: ", sess_id)

  // Renders card fields
  paypal.HostedFields.render({
    // Call your server to set up the transaction
    createOrder: () => {
      return fetch("/api/orders", {
        method: 'post'
        // use the "body" param to optionally pass additional order information like
        // product ids or amount.
      })
      .then((res) => res.json())
      .then((orderData) => {
        orderId = orderData.id; // needed later to complete capture
        return orderData.id
        
      })
    },
    styles: {
      '.valid': {
        color: 'green'
      },
      '.invalid': {
        color: 'red'
      }
    },
    fields: {
      number: {
        selector: "#card-number",
        placeholder: "4111 1111 1111 1111"
      },
      cvv: {
        selector: "#cvv",
        placeholder: "123"
      },
      expirationDate: {
        selector: "#expiration-date",
        placeholder: "MM/YY"
      }
    }
  }).then((cardFields) => {
    console.log("cardFields: ", cardFields)
   document.querySelector("#card-form").addEventListener("submit", (event) => {
      event.preventDefault();
      enrolled_courses = document.getElementById("enrolled_courses").value;
      company_id = document.getElementById("company_id").value;
      console.log("enrolled_courses: ", enrolled_courses);
      console.log("company_id: ", company_id);
      cardFields
        .submit({
          // Cardholder's first and last name
          cardholderName: document.getElementById("card-holder-name").value,
          enrolled_courses: document.getElementById("enrolled_courses").value,
          company_id: document.getElementById("company_id").value,
          
        })
        .then((data) => {
          console.log("data: ", data)
          fetch(`/api/orders/${orderId}/capture`, {
            method: "post",
          })
            .then((res) => res.json())
            .then((orderData) => {
              fetch(`/api/checkout/${sess_id}`, {
                method: "post",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({enrolled_courses: enrolled_courses, company_id: company_id})
                
              }).then(data =>{
                console.log("after checkout: ", data)
              })
              // /api/checkout/
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you
              // This example reads a v2/checkout/orders capture response, propagated from the server
              // You could use a different API or structure for your 'orderData'
              var errorDetail =
                Array.isArray(orderData.details) && orderData.details[0];
              if (errorDetail && errorDetail.issue === "INSTRUMENT_DECLINED") {
                return actions.restart(); // Recoverable state, per:
                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
              }
              if (errorDetail) {
                var msg = "Sorry, your transaction could not be processed.";
                if (errorDetail.description)
                  msg += "\n\n" + errorDetail.description;
                if (orderData.debug_id) msg += " (" + orderData.debug_id + ")";
                return alert(msg); // Show a failure message
              }
              // Show a success message or redirect
              alert("Transaction completed!");
            });
        })
        .catch((err) => {
          alert("Payment could not be captured! " + JSON.stringify(err));
        });
    });
  });
} else {
  // Hides card fields if the merchant isn't eligible
  document.querySelector("#card-form").style = 'display: none';
}
