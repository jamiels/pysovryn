// import React, { Fragment, useEffect, useState } from 'react';
//
// import { Container } from '@/components/container';
// import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
// import { useLayout } from '@/providers';
//
// import {
//   OrganizationProvider,
//   useOrganizations
// } from '@/pages/views/organizations/OrganizationContext.tsx';
// import { useSpace } from '@/contexts/UserLogContext.tsx';
// import { updateOrganization } from '@/services/organization_services.ts';
// import { IOrganization, IOrganizationUpdateRequest } from '@/services/interfaces/org.i.ts';
// import { KeenIcon } from '@/components';
// import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router';
//
// const OrganizationUpdatePage = () => {
//   return (
//     <OrganizationProvider>
//       <UpdateOrganizationContent />
//     </OrganizationProvider>
//   );
// };
//
// const UpdateOrganizationContent = () => {
//   const { fetchOrganizations } = useOrganizations();
//   const { activeSpace } = useSpace();
//
//   const [selectedOrganization, setSelectedOrganization] = useState<IOrganization | null>(null);
//
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { currentLayout } = useLayout();
//
//   useEffect(() => {
//     if (location.state) {
//       const organization = location.state.organization as IOrganization;
//       setSelectedOrganization(organization);
//     }
//   }, [location]);
//
//   const [formData, setFormData] = useState<IOrganizationUpdateRequest>({
//     name: selectedOrganization?.name || '',
//     space_id: selectedOrganization?.space_id || 0
//   });
//
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
//
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//
//     const is_updated = await updateOrganization(selectedOrganization?.id, formData);
//     if (is_updated) {
//       fetchOrganizations();
//       navigate(-1);
//       setFormData({
//         name: '',
//         space_id: activeSpace?.id as number
//       });
//     }
//   };
//
//   useEffect(() => {
//     if (selectedOrganization) {
//       setFormData({
//         name: selectedOrganization.name,
//         space_id: selectedOrganization.space_id
//       });
//     } else {
//       setFormData({
//         name: '',
//         space_id: activeSpace?.id as number
//       });
//     }
//   }, [selectedOrganization]);
//
//   return (
//     <Fragment>
//       {currentLayout?.name === 'demo1-layout' && (
//         <Container>
//           <Toolbar>
//             <ToolbarHeading>
//               <ToolbarPageTitle text={'Update Organization'} />
//             </ToolbarHeading>
//           </Toolbar>
//         </Container>
//       )}
//
//       <Container>
//         <div className="flex justify-center items-center py-10 container">
//           <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Organization Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="input input-sm w-full p-2 border border-gray-300 rounded-md"
//                 placeholder="Enter organization name"
//                 required
//               />
//             </div>
//
//             <div className="flex justify-center gap-3">
//               <button type="button" className="btn btn-sm btn-outline" onClick={() => navigate(-1)}>
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-sm btn-primary">
//                 <KeenIcon icon={'brifecase-tick'} />
//                 Update Organization
//               </button>
//             </div>
//           </form>
//         </div>
//       </Container>
//     </Fragment>
//   );
// };
//
// export { OrganizationUpdatePage };
