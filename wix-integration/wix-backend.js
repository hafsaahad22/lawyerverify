// Wix Backend Code for Data Collections Integration
import wixData from 'wix-data';

/**
 * HTTP Function: POST /verify-lawyer
 * Verifies lawyer credentials against Wix Data Collections
 */
export function post_verifyLawyer(request) {
  const { cnic, letterId } = request.body;
  
  // Validate input formats
  const cnicPattern = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
  const letterPattern = /^LTR-[0-9]{5}$/;
  
  if (!cnicPattern.test(cnic)) {
    return {
      status: 400,
      body: {
        error: "CNIC format is incorrect. Please use format: 12345-1234567-1",
        step: 1
      }
    };
  }
  
  if (!letterPattern.test(letterId)) {
    return {
      status: 400,
      body: {
        error: "Letter ID format is incorrect. Please use format: LTR-12345",
        step: 1
      }
    };
  }
  
  // Check for exact match
  return wixData.query('Lawyers')
    .eq('cnic', cnic)
    .eq('letterId', letterId)
    .eq('verified', true)
    .find()
    .then(results => {
      if (results.items.length > 0) {
        return {
          status: 200,
          body: {
            verified: true,
            fullName: results.items[0].fullName,
            step: 5
          }
        };
      }
      
      // Check for partial matches
      return Promise.all([
        wixData.query('Lawyers').eq('cnic', cnic).eq('verified', true).find(),
        wixData.query('Lawyers').eq('letterId', letterId).eq('verified', true).find()
      ]).then(([cnicResults, letterResults]) => {
        if (cnicResults.items.length > 0 && letterResults.items.length === 0) {
          return {
            status: 200,
            body: {
              verified: false,
              error: "CNIC is correct, but Letter ID is incorrect. Please verify your Letter ID and try again.",
              step: 1
            }
          };
        }
        
        if (letterResults.items.length > 0 && cnicResults.items.length === 0) {
          return {
            status: 200,
            body: {
              verified: false,
              error: "Letter ID is correct, but CNIC is incorrect. Please verify your CNIC and try again.",
              step: 1
            }
          };
        }
        
        // No match found - create verification request
        return wixData.insert('VerificationRequests', {
          cnic: cnic,
          letterId: letterId,
          status: 'pending',
          submittedAt: new Date()
        }).then(() => {
          return {
            status: 200,
            body: {
              verified: false,
              pending: true,
              message: "Your credentials are not in our database. Your request has been submitted for manual verification by our admin team.",
              step: 4
            }
          };
        });
      });
    })
    .catch(error => {
      console.error('Database error:', error);
      return {
        status: 500,
        body: { error: "Internal server error" }
      };
    });
}