// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
  
export const environment = {
  // production: true,
  //  url: 'https://portal.coepvlab.ac.in/virtualmathlab/api/',
  //  authUrl: 'https://portal.coepvlab.ac.in/virtualmathlab',
  //  fileurl:'https://portal.coepvlab.ac.in/virtualmathlab/QueFiles/',

  // url: 'http://localhost:8080/virtualmathlab/api/',
  // authUrl:'http://localhost:8080/virtualmathlab',
  // fileurl:'http://localhost:8080/QueFiles/',

  url: 'http://192.168.1.87:8080/virtualmathlab/api/',
   authUrl:'http://192.168.1.87:8080/virtualmathlab',
   fileurl:'http://192.168.1.87:8080/virtualmathlab/QueFiles/',
   
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.