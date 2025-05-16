// import { create } from 'zustand';

// export const useProfileStore = create((set) => ({
//   profile: {
//     fullName: '',
//     email: '',
//     dob: '',
//     location: '',
//     bio: '',
//     userType: '',
//     skills: [],
//     linkedin: '',
//     website: '',
//     startupName: '',
//     startupStage: '',
//     awards: '',
//     profilePic: null,
//     experiences: [],
//   },
//   isSubmitting: false,
//   setProfileField: (field, value) =>
//     set((state) => ({
//       profile: { ...state.profile, [field]: value },
//     })),
//   setSkill: (skill) =>
//     set((state) => {
//       const skills = state.profile.skills.includes(skill)
//         ? state.profile.skills.filter((s) => s !== skill)
//         : [...state.profile.skills, skill];
//       return { profile: { ...state.profile, skills } };
//     }),
//   setProfileData: (data) => set({ profile: data }),
//   setIsSubmitting: (status) => set({ isSubmitting: status }),
//   updateExperience: (id, updatedExperience) =>
//     set((state) => ({
//       profile: {
//         ...state.profile,
//         experiences: state.profile.experiences.map((exp) =>
//           exp.id === id ? updatedExperience : exp
//         ),
//       },
//     })),
//   addExperience: () =>
//     set((state) => ({
//       profile: {
//         ...state.profile,
//         experiences: [
//           ...state.profile.experiences,
//           {
//             id: Date.now(),
//             role: '',
//             organization: '',
//             startDate: '',
//             endDate: '',
//             description: '',
//           },
//         ],
//       },
//     })),
//   removeExperience: (id) =>
//     set((state) => ({
//       profile: {
//         ...state.profile,
//         experiences: state.profile.experiences.filter((exp) => exp.id !== id),
//       },
//     })),
// }));
