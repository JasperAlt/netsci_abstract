These files create the visualization for the online supplementary materials for our NetSci '19 [conference abstract](web.cecs.pdx.edu/jalt/netsci_supplemental.html).


The object created by coords2.js is not rendered in the final version but still contains the data that the visualization works off of (it comes from the code for my [homophily visualization](web.cecs.pdx.edu/jalt/homophily.html), where it appears on the left, with some changes to remove dependencies on even older projects).


Plot2.js creates the visualization of the particles and network. This is a simple modification of the original homophily plot and uses the O(n^2) naive approach to solving the fixed-radius near neighbors problem. If no nodes are touching the [-10, 10] boundaries of the box, it zooms in to an appropriate scale.
