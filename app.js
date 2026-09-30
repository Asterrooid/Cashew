// ============================================================================
// CASHEW WORKS // DIGITAL TWIN 3D SIMULATION APPLICATION LOGIC
// Integrates SceneEnvironment, EquipmentModels, Modern HUD, and Animation Engine
// ============================================================================

const DATA = [{"id": 1, "times": [2.4, 2.5, 1.5, 1.4, 2.0, 1.6, 1.5, 2.2], "arrivals": [11.7, 22.9, 13.6]}, {"id": 2, "times": [19.6, 2.2, 1.8, 1.6, 7.3, 1.8, 32.3, 2.2], "arrivals": [8.7, 7.9, 11.0]}, {"id": 3, "times": [3.2, 2.0, 1.7, 1.1, 2.0, 1.7, 1.2, 2.3], "arrivals": [12.7, 27.4, 11.0]}, {"id": 4, "times": [2.9, 2.4, 1.6, 1.5, 1.7, 1.3, 1.7, 2.0], "arrivals": [13.1, 13.5, 10.3]}, {"id": 5, "times": [3.5, 2.4, 1.8, 1.6, 2.2, 1.6, 1.4, 2.6], "arrivals": [6.7, 14.7, 11.6]}, {"id": 6, "times": [18.8, 2.0, 1.3, 1.4, 6.1, 1.7, 33.4, 2.2], "arrivals": [8.1, 10.2, 11.3]}, {"id": 7, "times": [3.1, 2.4, 1.3, 1.5, 2.0, 1.4, 1.5, 1.6], "arrivals": [11.3, 13.5, 12.1]}, {"id": 8, "times": [14.8, 2.5, 1.7, 1.3, 6.8, 1.5, 34.9, 1.8], "arrivals": [10.3, 21.0, 9.8]}, {"id": 9, "times": [3.0, 2.4, 1.6, 1.4, 2.0, 1.2, 1.4, 1.7], "arrivals": [11.0, 17.7, 9.9]}, {"id": 10, "times": [3.0, 2.4, 1.6, 1.2, 1.9, 1.5, 1.6, 2.1], "arrivals": [9.1, 23.0, 9.9]}, {"id": 11, "times": [3.0, 2.0, 1.4, 1.0, 1.9, 1.3, 1.3, 2.1], "arrivals": [12.9, 25.8, 11.5]}, {"id": 12, "times": [3.3, 2.4, 1.6, 1.5, 1.9, 1.5, 1.3, 2.0], "arrivals": [12.7, 17.0, 12.4]}, {"id": 13, "times": [3.4, 2.2, 1.9, 1.3, 1.8, 1.3, 1.5, 2.6], "arrivals": [11.1, 23.0, 9.9]}, {"id": 14, "times": [3.0, 2.2, 1.7, 1.3, 1.8, 1.6, 1.7, 2.2], "arrivals": [13.5, 26.4, 9.9]}, {"id": 15, "times": [3.2, 2.5, 1.6, 1.2, 2.2, 1.7, 1.7, 2.3], "arrivals": [12.0, 26.0, 10.9]}, {"id": 16, "times": [2.8, 2.6, 1.5, 1.2, 1.9, 1.4, 1.4, 1.9], "arrivals": [9.1, 28.5, 10.2]}, {"id": 17, "times": [3.2, 2.7, 1.5, 1.4, 1.7, 1.3, 1.7, 1.9], "arrivals": [11.8, 15.3, 11.7]}, {"id": 18, "times": [2.8, 2.6, 1.3, 1.3, 1.8, 1.2, 1.3, 2.1], "arrivals": [8.9, 11.8, 7.6]}, {"id": 19, "times": [17.7, 2.3, 1.6, 1.5, 7.4, 1.5, 31.8, 2.1], "arrivals": [12.9, 19.6, 9.4]}, {"id": 20, "times": [20.1, 2.4, 1.7, 1.5, 7.5, 1.4, 38.8, 1.6], "arrivals": [10.9, 26.1, 9.5]}, {"id": 21, "times": [19.1, 2.5, 1.4, 1.4, 7.0, 1.3, 27.7, 2.1], "arrivals": [10.6, 18.6, 7.5]}, {"id": 22, "times": [2.3, 2.3, 1.5, 1.4, 1.8, 1.6, 1.4, 2.1], "arrivals": [9.5, 14.1, 9.2]}, {"id": 23, "times": [2.8, 2.3, 1.4, 1.6, 2.0, 1.4, 1.9, 2.0], "arrivals": [13.7, 26.1, 9.3]}, {"id": 24, "times": [3.4, 2.5, 1.5, 1.2, 1.8, 1.3, 1.6, 1.9], "arrivals": [10.7, 18.5, 10.2]}, {"id": 25, "times": [18.5, 2.3, 1.6, 1.4, 6.9, 1.4, 29.7, 2.0], "arrivals": [10.1, 23.4, 11.9]}, {"id": 26, "times": [3.1, 2.1, 1.3, 1.6, 2.1, 1.7, 1.4, 2.1], "arrivals": [10.2, 18.4, 10.2]}, {"id": 27, "times": [3.3, 2.2, 1.7, 1.6, 2.1, 1.6, 1.7, 2.1], "arrivals": [12.2, 7.8, 9.2]}, {"id": 28, "times": [3.1, 2.4, 1.7, 1.2, 1.7, 1.5, 1.7, 2.3], "arrivals": [11.8, 14.7, 10.4]}, {"id": 29, "times": [3.4, 2.3, 1.6, 1.4, 1.7, 1.6, 1.5, 2.4], "arrivals": [11.9, 9.6, 11.9]}, {"id": 30, "times": [3.3, 2.4, 1.2, 1.6, 1.9, 1.3, 1.5, 2.0], "arrivals": [11.9, 12.6, 9.2]}, {"id": 31, "times": [3.5, 2.4, 1.5, 1.5, 2.2, 1.5, 1.7, 2.0], "arrivals": [15.7, 29.4, 9.3]}, {"id": 32, "times": [3.1, 2.2, 1.8, 1.4, 1.5, 1.5, 1.5, 2.2], "arrivals": [10.1, 17.9, 11.2]}, {"id": 33, "times": [3.3, 2.5, 1.2, 1.4, 2.0, 1.4, 1.2, 2.3], "arrivals": [9.9, 11.8, 10.2]}, {"id": 34, "times": [2.9, 2.4, 1.5, 1.3, 1.6, 1.6, 1.3, 2.0], "arrivals": [9.2, 10.3, 11.3]}, {"id": 35, "times": [2.8, 2.0, 1.4, 1.4, 1.8, 1.4, 1.5, 2.3], "arrivals": [12.4, 15.2, 10.5]}, {"id": 36, "times": [3.5, 2.6, 1.7, 1.4, 1.8, 1.6, 1.7, 2.3], "arrivals": [13.5, 9.4, 11.4]}, {"id": 37, "times": [3.1, 2.2, 1.5, 1.4, 1.8, 1.6, 1.8, 2.4], "arrivals": [10.7, 11.9, 9.2]}, {"id": 38, "times": [3.2, 1.9, 1.7, 1.4, 1.8, 1.1, 1.7, 2.5], "arrivals": [9.2, 16.4, 10.5]}, {"id": 39, "times": [16.1, 2.1, 1.7, 1.3, 7.2, 1.7, 29.5, 1.9], "arrivals": [9.2, 20.3, 10.2]}, {"id": 40, "times": [2.8, 2.1, 1.9, 1.5, 1.8, 1.0, 1.6, 2.1], "arrivals": [12.4, 17.8, 8.9]}, {"id": 41, "times": [3.0, 2.3, 1.6, 1.8, 1.6, 1.4, 1.4, 2.1], "arrivals": [12.6, 4.5, 8.5]}, {"id": 42, "times": [3.4, 2.2, 1.7, 1.1, 2.1, 1.7, 1.5, 2.1], "arrivals": [12.2, 16.4, 11.4]}, {"id": 43, "times": [3.2, 2.2, 1.4, 1.4, 2.1, 1.5, 1.3, 1.9], "arrivals": [9.5, 15.3, 10.0]}, {"id": 44, "times": [2.5, 2.4, 1.8, 1.3, 2.1, 1.3, 1.3, 1.7], "arrivals": [11.5, 16.9, 9.2]}, {"id": 45, "times": [2.9, 2.4, 1.5, 1.5, 1.6, 1.3, 1.6, 2.1], "arrivals": [11.3, 22.4, 10.4]}, {"id": 46, "times": [3.5, 2.4, 1.5, 1.4, 2.0, 1.7, 1.5, 1.9], "arrivals": [11.5, 5.5, 12.0]}, {"id": 47, "times": [2.9, 2.4, 1.6, 1.5, 2.0, 1.2, 1.6, 2.1], "arrivals": [12.9, 12.3, 7.5]}, {"id": 48, "times": [2.5, 2.4, 1.4, 1.6, 1.7, 1.7, 1.6, 1.9], "arrivals": [11.5, 17.7, 8.6]}, {"id": 49, "times": [3.6, 1.8, 1.6, 1.4, 1.9, 1.5, 1.5, 1.8], "arrivals": [12.5, 7.7, 9.3]}, {"id": 50, "times": [21.0, 2.2, 1.7, 1.6, 6.9, 1.3, 31.7, 2.2], "arrivals": [11.1, 21.8, 12.4]}, {"id": 51, "times": [18.1, 1.8, 1.6, 1.0, 6.7, 1.4, 26.7, 2.1], "arrivals": [11.6, 16.7, 10.9]}, {"id": 52, "times": [2.9, 2.3, 1.4, 1.6, 2.3, 1.3, 1.6, 2.2], "arrivals": [12.4, 18.9, 11.5]}, {"id": 53, "times": [3.3, 2.3, 1.6, 1.5, 1.6, 1.6, 1.4, 2.6], "arrivals": [7.8, 12.4, 9.0]}, {"id": 54, "times": [2.8, 2.5, 1.7, 1.6, 2.4, 1.6, 1.6, 2.2], "arrivals": [10.3, 18.7, 9.0]}, {"id": 55, "times": [3.3, 2.6, 1.3, 1.2, 1.7, 1.2, 1.6, 2.2], "arrivals": [10.0, 19.9, 11.1]}, {"id": 56, "times": [3.2, 2.3, 1.4, 1.3, 2.1, 1.4, 1.4, 1.8], "arrivals": [9.6, 16.1, 10.6]}, {"id": 57, "times": [3.1, 2.2, 1.7, 1.4, 2.1, 1.4, 1.5, 1.8], "arrivals": [10.4, 16.1, 11.2]}, {"id": 58, "times": [3.0, 2.4, 1.6, 1.4, 1.7, 1.7, 1.4, 2.5], "arrivals": [14.3, 16.2, 10.3]}, {"id": 59, "times": [2.9, 2.2, 1.7, 1.4, 2.0, 1.3, 1.4, 1.9], "arrivals": [9.1, 11.0, 10.9]}, {"id": 60, "times": [3.3, 2.3, 1.9, 1.6, 1.9, 1.7, 1.3, 1.8], "arrivals": [13.1, 27.6, 10.7]}, {"id": 61, "times": [2.7, 2.5, 1.7, 1.1, 2.0, 1.5, 1.8, 2.1], "arrivals": [7.3, 14.3, 11.5]}, {"id": 62, "times": [2.5, 2.2, 1.7, 1.5, 1.9, 1.3, 1.7, 2.1], "arrivals": [10.3, 16.8, 11.5]}, {"id": 63, "times": [3.2, 2.5, 2.0, 1.4, 2.1, 1.4, 1.6, 1.9], "arrivals": [11.4, 19.6, 8.4]}, {"id": 64, "times": [3.2, 2.4, 1.6, 1.4, 1.9, 1.4, 1.9, 2.0], "arrivals": [12.3, 27.9, 7.6]}, {"id": 65, "times": [3.1, 2.1, 1.5, 1.2, 1.9, 1.3, 1.5, 2.4], "arrivals": [12.6, 14.4, 11.8]}, {"id": 66, "times": [19.3, 2.5, 1.7, 1.5, 7.3, 1.5, 33.9, 1.9], "arrivals": [12.7, 29.8, 12.0]}, {"id": 67, "times": [2.9, 2.5, 1.7, 1.0, 2.0, 1.3, 1.5, 1.8], "arrivals": [10.2, 11.6, 9.2]}, {"id": 68, "times": [3.2, 2.3, 1.5, 1.5, 2.0, 1.2, 1.6, 2.3], "arrivals": [10.0, 11.2, 8.1]}, {"id": 69, "times": [3.0, 2.1, 1.4, 1.2, 1.8, 1.4, 1.4, 2.2], "arrivals": [12.9, 15.9, 10.6]}, {"id": 70, "times": [2.9, 2.1, 1.9, 1.4, 1.7, 1.2, 1.6, 1.9], "arrivals": [10.6, 18.9, 11.7]}, {"id": 71, "times": [2.9, 2.2, 1.6, 1.4, 1.8, 1.4, 1.7, 1.7], "arrivals": [8.2, 27.2, 12.8]}, {"id": 72, "times": [3.6, 2.4, 1.5, 1.6, 1.8, 1.4, 1.5, 1.9], "arrivals": [8.5, 21.1, 11.2]}, {"id": 73, "times": [15.2, 2.1, 1.7, 1.4, 7.8, 1.4, 34.3, 2.1], "arrivals": [9.0, 25.7, 10.0]}, {"id": 74, "times": [3.1, 2.4, 1.6, 1.3, 2.1, 1.8, 1.5, 2.4], "arrivals": [12.1, 18.9, 9.3]}, {"id": 75, "times": [2.5, 2.0, 1.6, 1.3, 1.9, 1.5, 1.6, 1.8], "arrivals": [11.3, 17.5, 10.5]}, {"id": 76, "times": [18.1, 2.3, 1.7, 1.6, 6.8, 1.5, 27.9, 2.1], "arrivals": [12.5, 25.7, 10.1]}, {"id": 77, "times": [2.9, 2.3, 1.4, 1.5, 2.2, 1.2, 1.6, 2.3], "arrivals": [10.1, 14.1, 9.2]}, {"id": 78, "times": [2.4, 2.8, 1.7, 1.3, 1.9, 1.4, 1.5, 1.5], "arrivals": [11.3, 5.8, 13.2]}, {"id": 79, "times": [3.1, 2.0, 1.9, 1.4, 1.7, 1.5, 1.4, 2.4], "arrivals": [12.4, 22.4, 12.8]}, {"id": 80, "times": [2.9, 2.6, 1.7, 1.2, 2.2, 1.3, 1.3, 1.8], "arrivals": [10.3, 12.9, 12.0]}, {"id": 81, "times": [2.4, 2.3, 1.5, 1.5, 1.9, 1.6, 2.0, 2.2], "arrivals": [12.0, 15.5, 9.3]}, {"id": 82, "times": [16.6, 2.4, 1.5, 1.1, 6.7, 1.3, 32.2, 2.2], "arrivals": [9.5, 21.0, 11.6]}, {"id": 83, "times": [3.4, 2.3, 1.5, 1.5, 1.8, 1.5, 1.2, 2.4], "arrivals": [10.2, 7.6, 11.3]}, {"id": 84, "times": [18.0, 2.4, 1.6, 1.4, 6.6, 1.4, 34.2, 2.2], "arrivals": [10.2, 9.2, 11.1]}, {"id": 85, "times": [15.2, 2.3, 1.5, 1.8, 7.1, 1.5, 32.1, 1.5], "arrivals": [8.4, 7.6, 12.1]}, {"id": 86, "times": [17.4, 2.6, 1.7, 1.2, 7.6, 1.4, 30.5, 1.9], "arrivals": [12.1, 11.3, 11.3]}, {"id": 87, "times": [3.4, 2.2, 1.3, 1.4, 1.7, 1.5, 1.6, 2.1], "arrivals": [10.0, 17.0, 11.5]}, {"id": 88, "times": [3.5, 2.5, 1.7, 1.7, 2.5, 1.5, 1.6, 2.1], "arrivals": [11.0, 17.4, 11.3]}, {"id": 89, "times": [3.3, 2.2, 1.5, 1.6, 1.7, 1.4, 1.4, 2.2], "arrivals": [12.1, 16.3, 10.9]}, {"id": 90, "times": [17.4, 2.3, 1.7, 1.3, 7.5, 1.6, 29.9, 2.3], "arrivals": [12.0, 8.5, 8.2]}, {"id": 91, "times": [3.1, 2.1, 1.4, 1.4, 2.0, 1.5, 1.3, 2.3], "arrivals": [12.5, 4.4, 10.6]}, {"id": 92, "times": [3.1, 2.4, 1.8, 1.4, 2.2, 1.5, 1.4, 2.0], "arrivals": [10.8, 15.3, 9.8]}, {"id": 93, "times": [2.5, 2.6, 1.8, 1.4, 1.9, 1.4, 1.3, 1.6], "arrivals": [10.1, 12.8, 8.8]}, {"id": 94, "times": [3.1, 2.3, 1.7, 1.3, 2.0, 1.6, 1.3, 2.0], "arrivals": [10.8, 17.1, 12.7]}, {"id": 95, "times": [3.7, 2.3, 1.4, 1.4, 1.5, 1.5, 1.7, 2.2], "arrivals": [7.3, 18.2, 12.7]}, {"id": 96, "times": [3.2, 2.1, 1.7, 1.2, 1.8, 1.5, 1.6, 1.8], "arrivals": [7.8, 15.6, 12.3]}, {"id": 97, "times": [3.4, 2.2, 1.7, 1.4, 1.7, 1.5, 1.7, 2.3], "arrivals": [8.1, 18.5, 10.8]}, {"id": 98, "times": [3.1, 1.9, 1.4, 1.5, 1.5, 1.8, 1.5, 2.3], "arrivals": [8.8, 16.1, 12.3]}, {"id": 99, "times": [3.0, 2.1, 1.6, 1.4, 1.9, 1.3, 1.7, 2.1], "arrivals": [11.9, 17.4, 10.5]}, {"id": 100, "times": [3.1, 2.3, 1.7, 1.2, 1.5, 1.6, 1.1, 1.3], "arrivals": [9.0, 11.8, 10.8]}, {"id": 101, "times": [19.5, 2.6, 1.7, 1.5, 7.7, 1.2, 34.1, 1.8], "arrivals": [10.2, 14.2, 9.1]}, {"id": 102, "times": [2.7, 2.9, 1.6, 1.5, 1.8, 1.5, 1.5, 2.6], "arrivals": [13.9, 15.9, 11.0]}, {"id": 103, "times": [3.4, 2.2, 1.6, 1.3, 1.7, 1.7, 1.6, 2.0], "arrivals": [10.2, 18.8, 10.6]}, {"id": 104, "times": [3.4, 2.6, 1.8, 1.4, 2.0, 1.6, 1.6, 1.6], "arrivals": [12.6, 25.8, 8.8]}, {"id": 105, "times": [19.1, 2.4, 1.8, 1.2, 6.2, 1.5, 33.0, 2.4], "arrivals": [8.9, 29.5, 10.4]}, {"id": 106, "times": [17.4, 2.3, 1.2, 1.2, 6.6, 1.4, 26.2, 2.1], "arrivals": [10.5, 13.8, 10.4]}, {"id": 107, "times": [3.0, 2.4, 1.6, 1.3, 2.1, 1.5, 1.4, 2.4], "arrivals": [8.9, 14.5, 12.8]}, {"id": 108, "times": [3.1, 2.3, 1.6, 1.6, 2.1, 1.5, 1.6, 2.2], "arrivals": [10.3, 18.8, 11.7]}, {"id": 109, "times": [3.1, 2.3, 1.3, 1.3, 1.9, 1.4, 1.6, 2.2], "arrivals": [12.8, 24.8, 10.5]}, {"id": 110, "times": [3.3, 2.2, 1.6, 1.5, 2.0, 1.5, 1.2, 2.2], "arrivals": [7.2, 9.0, 10.8]}, {"id": 111, "times": [3.0, 2.0, 1.8, 1.3, 2.0, 1.5, 1.3, 2.3], "arrivals": [12.0, 8.2, 10.6]}, {"id": 112, "times": [3.4, 2.0, 1.4, 1.4, 1.9, 1.4, 1.4, 2.7], "arrivals": [11.5, 4.3, 10.2]}, {"id": 113, "times": [3.1, 2.4, 1.7, 1.4, 1.8, 1.4, 1.4, 2.3], "arrivals": [9.7, 11.9, 9.1]}, {"id": 114, "times": [3.2, 2.2, 1.5, 1.5, 1.8, 1.3, 1.2, 1.7], "arrivals": [7.8, 25.4, 10.3]}, {"id": 115, "times": [2.8, 2.2, 1.5, 1.3, 1.7, 1.6, 1.2, 2.2], "arrivals": [11.2, 13.7, 9.5]}, {"id": 116, "times": [17.0, 2.3, 1.8, 1.2, 7.9, 1.6, 34.6, 2.4], "arrivals": [9.8, 27.5, 8.9]}, {"id": 117, "times": [3.1, 2.5, 1.5, 1.2, 1.9, 1.5, 1.5, 2.4], "arrivals": [11.5, 20.0, 11.2]}, {"id": 118, "times": [3.2, 2.3, 1.7, 1.3, 1.8, 1.6, 1.3, 2.0], "arrivals": [11.0, 21.1, 11.0]}, {"id": 119, "times": [2.5, 2.2, 1.3, 1.2, 1.8, 1.5, 1.5, 2.4], "arrivals": [14.5, 14.7, 8.2]}, {"id": 120, "times": [2.8, 2.6, 1.9, 1.5, 1.7, 1.6, 1.7, 2.3], "arrivals": [10.5, 21.2, 10.3]}, {"id": 121, "times": [18.7, 2.6, 1.7, 1.3, 8.1, 1.5, 35.6, 2.7], "arrivals": [8.7, 15.4, 11.8]}, {"id": 122, "times": [3.1, 2.4, 1.6, 1.8, 1.9, 1.5, 1.5, 1.9], "arrivals": [11.4, 26.2, 11.9]}, {"id": 123, "times": [2.4, 2.5, 1.7, 1.1, 1.7, 1.4, 1.7, 2.0], "arrivals": [11.5, 12.3, 11.8]}, {"id": 124, "times": [17.9, 2.6, 1.4, 1.4, 7.7, 1.8, 36.9, 2.0], "arrivals": [14.0, 8.2, 10.6]}, {"id": 125, "times": [2.8, 2.5, 1.8, 1.2, 1.8, 1.4, 1.4, 2.0], "arrivals": [12.8, 10.9, 9.4]}, {"id": 126, "times": [3.4, 2.4, 1.6, 1.3, 1.6, 1.4, 1.7, 1.9], "arrivals": [11.8, 13.4, 9.1]}, {"id": 127, "times": [3.0, 2.4, 1.6, 1.4, 2.1, 1.6, 1.4, 1.4], "arrivals": [14.2, 18.7, 10.9]}, {"id": 128, "times": [3.1, 2.4, 1.5, 1.1, 1.8, 1.5, 1.7, 2.0], "arrivals": [8.4, 22.9, 11.0]}, {"id": 129, "times": [3.4, 2.1, 1.5, 1.4, 1.8, 1.3, 1.6, 2.2], "arrivals": [9.6, 8.6, 12.2]}, {"id": 130, "times": [2.7, 2.5, 1.7, 1.7, 1.9, 1.7, 1.4, 2.0], "arrivals": [9.0, 16.8, 11.9]}, {"id": 131, "times": [19.4, 2.0, 1.6, 1.3, 6.7, 1.5, 34.1, 2.6], "arrivals": [10.1, 10.2, 10.3]}, {"id": 132, "times": [20.3, 2.1, 1.7, 1.4, 6.8, 1.3, 35.4, 2.1], "arrivals": [8.0, 17.2, 8.9]}, {"id": 133, "times": [3.2, 2.6, 1.6, 1.6, 1.7, 1.7, 1.7, 2.4], "arrivals": [12.4, 14.4, 10.1]}, {"id": 134, "times": [2.6, 2.5, 1.7, 1.4, 2.0, 1.6, 1.4, 2.2], "arrivals": [10.5, 6.6, 10.8]}, {"id": 135, "times": [2.5, 2.6, 1.5, 1.3, 1.8, 1.3, 1.5, 2.3], "arrivals": [7.8, 19.3, 10.2]}, {"id": 136, "times": [3.2, 2.2, 1.9, 1.1, 2.3, 1.8, 1.5, 2.2], "arrivals": [8.8, 12.2, 9.7]}, {"id": 137, "times": [2.8, 2.0, 1.4, 1.5, 1.9, 1.6, 1.6, 2.4], "arrivals": [11.7, 12.5, 10.8]}, {"id": 138, "times": [2.9, 2.2, 1.8, 1.4, 1.5, 1.5, 1.3, 2.1], "arrivals": [12.8, 10.1, 9.8]}, {"id": 139, "times": [19.4, 2.3, 1.8, 1.2, 6.7, 1.7, 30.9, 2.2], "arrivals": [15.4, 12.0, 9.7]}, {"id": 140, "times": [2.8, 2.3, 1.5, 1.4, 2.3, 1.5, 1.6, 2.2], "arrivals": [17.4, 17.0, 10.9]}, {"id": 141, "times": [3.0, 2.5, 1.9, 1.3, 2.2, 1.5, 1.2, 2.0], "arrivals": [11.9, 14.1, 10.0]}, {"id": 142, "times": [3.3, 2.2, 1.7, 1.3, 2.3, 1.4, 1.7, 2.2], "arrivals": [8.8, 16.5, 10.8]}, {"id": 143, "times": [2.8, 2.4, 1.7, 1.5, 1.7, 1.6, 1.9, 2.7], "arrivals": [6.3, 16.7, 10.9]}, {"id": 144, "times": [3.5, 2.1, 1.6, 1.2, 2.1, 1.6, 1.7, 2.0], "arrivals": [11.6, 21.1, 9.0]}, {"id": 145, "times": [2.8, 2.4, 1.6, 1.6, 1.8, 1.5, 1.8, 2.2], "arrivals": [9.2, 13.4, 9.9]}, {"id": 146, "times": [2.8, 2.3, 1.6, 1.2, 1.9, 1.4, 1.5, 2.4], "arrivals": [10.1, 25.9, 12.4]}, {"id": 147, "times": [3.5, 2.1, 1.7, 1.3, 1.6, 1.5, 1.2, 2.4], "arrivals": [9.7, 19.9, 9.0]}, {"id": 148, "times": [3.1, 2.2, 1.8, 1.7, 1.8, 1.5, 1.1, 2.1], "arrivals": [10.7, 13.5, 7.7]}, {"id": 149, "times": [2.8, 2.3, 1.6, 1.6, 1.8, 1.3, 1.6, 1.5], "arrivals": [13.3, 20.1, 8.1]}, {"id": 150, "times": [3.0, 2.2, 1.5, 1.4, 2.1, 1.3, 1.4, 2.2], "arrivals": [11.3, 28.8, 10.5]}, {"id": 151, "times": [3.4, 2.7, 1.7, 1.3, 2.1, 1.6, 1.3, 1.5], "arrivals": [10.7, 14.4, 10.5]}, {"id": 152, "times": [3.4, 2.3, 1.7, 1.3, 2.0, 1.1, 1.5, 2.5], "arrivals": [8.7, 16.6, 10.3]}, {"id": 153, "times": [2.8, 2.2, 1.7, 1.4, 1.6, 1.5, 1.6, 2.1], "arrivals": [7.3, 24.0, 12.1]}, {"id": 154, "times": [3.0, 1.8, 1.7, 1.4, 1.8, 1.4, 1.2, 2.3], "arrivals": [9.9, 24.6, 7.0]}, {"id": 155, "times": [17.9, 2.1, 1.6, 1.4, 6.0, 1.7, 33.6, 1.9], "arrivals": [10.9, 15.3, 11.0]}, {"id": 156, "times": [2.7, 2.2, 1.5, 1.4, 2.1, 1.4, 1.8, 1.7], "arrivals": [14.9, 15.7, 12.5]}, {"id": 157, "times": [18.8, 2.1, 1.5, 1.4, 6.1, 1.6, 33.3, 2.2], "arrivals": [11.3, 20.0, 9.0]}, {"id": 158, "times": [3.0, 2.6, 1.4, 1.2, 2.1, 1.4, 1.7, 2.1], "arrivals": [13.2, 11.1, 10.0]}, {"id": 159, "times": [3.3, 2.3, 1.6, 1.3, 1.7, 1.5, 1.4, 2.0], "arrivals": [9.9, 16.5, 9.5]}, {"id": 160, "times": [3.4, 2.6, 1.6, 1.5, 1.4, 1.6, 1.6, 2.1], "arrivals": [8.4, 14.9, 9.3]}, {"id": 161, "times": [2.9, 2.3, 1.5, 1.2, 1.5, 1.4, 1.7, 2.8], "arrivals": [8.9, 16.4, 10.1]}, {"id": 162, "times": [2.9, 2.3, 1.2, 1.4, 2.2, 1.6, 1.6, 2.3], "arrivals": [9.4, 11.2, 12.4]}, {"id": 163, "times": [3.2, 2.3, 1.4, 1.3, 1.8, 1.4, 1.7, 2.4], "arrivals": [15.7, 7.7, 12.9]}, {"id": 164, "times": [2.8, 2.3, 1.8, 1.4, 1.7, 1.5, 1.3, 2.3], "arrivals": [9.2, 5.5, 10.1]}, {"id": 165, "times": [3.2, 2.7, 1.5, 1.3, 2.2, 1.6, 1.7, 2.5], "arrivals": [12.8, 9.9, 13.0]}, {"id": 166, "times": [16.2, 1.8, 1.7, 1.6, 7.0, 1.6, 36.4, 2.1], "arrivals": [9.0, 12.9, 10.5]}, {"id": 167, "times": [2.7, 1.9, 1.4, 1.5, 1.9, 1.8, 1.6, 1.6], "arrivals": [13.0, 13.7, 12.8]}, {"id": 168, "times": [2.7, 2.2, 1.8, 1.2, 1.8, 1.4, 1.6, 2.1], "arrivals": [11.8, 23.9, 10.4]}, {"id": 169, "times": [3.4, 2.3, 1.6, 1.5, 1.9, 1.3, 1.6, 2.3], "arrivals": [10.7, 20.1, 10.7]}, {"id": 170, "times": [3.0, 2.5, 1.6, 1.3, 1.9, 1.4, 1.6, 1.9], "arrivals": [10.9, 10.6, 11.0]}, {"id": 171, "times": [3.5, 2.4, 1.9, 1.3, 2.2, 1.6, 1.3, 2.1], "arrivals": [9.6, 16.6, 14.6]}, {"id": 172, "times": [2.8, 2.2, 1.8, 1.4, 2.0, 1.6, 1.2, 1.9], "arrivals": [12.0, 13.1, 11.6]}, {"id": 173, "times": [3.1, 2.5, 1.6, 1.3, 2.0, 1.5, 1.7, 2.5], "arrivals": [10.0, 27.8, 9.6]}, {"id": 174, "times": [3.7, 2.5, 1.5, 1.5, 2.1, 1.3, 1.5, 2.3], "arrivals": [8.3, 15.9, 11.8]}, {"id": 175, "times": [2.7, 2.3, 1.6, 1.3, 1.7, 1.6, 1.7, 2.3], "arrivals": [8.2, 17.8, 10.0]}, {"id": 176, "times": [2.4, 2.5, 1.7, 1.3, 2.1, 1.3, 1.5, 2.3], "arrivals": [11.4, 13.4, 9.9]}, {"id": 177, "times": [3.4, 2.4, 1.6, 1.3, 1.8, 1.7, 1.2, 2.1], "arrivals": [14.5, 19.9, 11.7]}, {"id": 178, "times": [2.8, 2.2, 1.5, 1.3, 1.4, 1.9, 1.7, 2.1], "arrivals": [11.4, 9.7, 10.5]}, {"id": 179, "times": [3.0, 2.5, 1.8, 1.6, 1.5, 1.6, 1.4, 1.8], "arrivals": [10.7, 15.0, 10.9]}, {"id": 180, "times": [2.8, 2.3, 1.6, 1.5, 1.7, 1.6, 1.6, 1.6], "arrivals": [11.6, 26.9, 10.5]}, {"id": 181, "times": [3.1, 2.3, 1.9, 1.7, 2.0, 1.4, 1.4, 2.1], "arrivals": [13.9, 16.0, 10.9]}, {"id": 182, "times": [2.7, 2.6, 1.6, 1.7, 1.9, 1.2, 1.8, 2.2], "arrivals": [11.5, 21.6, 11.1]}, {"id": 183, "times": [2.9, 1.8, 1.9, 1.2, 1.9, 1.4, 1.3, 2.4], "arrivals": [10.1, 15.4, 8.0]}, {"id": 184, "times": [3.1, 2.0, 1.7, 1.4, 2.3, 1.3, 1.4, 2.5], "arrivals": [13.4, 17.7, 11.4]}, {"id": 185, "times": [2.7, 2.0, 1.7, 1.2, 1.6, 1.3, 1.5, 2.5], "arrivals": [11.9, 14.7, 9.2]}, {"id": 186, "times": [2.8, 2.2, 1.5, 1.3, 1.9, 1.8, 1.3, 1.9], "arrivals": [14.4, 14.2, 8.6]}, {"id": 187, "times": [2.9, 2.2, 1.5, 1.3, 2.0, 1.5, 1.6, 2.0], "arrivals": [11.4, 11.4, 10.4]}, {"id": 188, "times": [2.6, 2.0, 1.7, 1.2, 1.8, 1.6, 1.8, 2.2], "arrivals": [8.3, 17.0, 10.6]}, {"id": 189, "times": [2.9, 2.1, 1.7, 1.2, 1.9, 1.5, 1.4, 2.7], "arrivals": [8.0, 11.1, 9.6]}, {"id": 190, "times": [3.0, 2.1, 1.6, 1.4, 1.6, 1.5, 1.6, 2.5], "arrivals": [14.6, 28.3, 11.6]}, {"id": 191, "times": [2.9, 2.8, 1.4, 1.2, 2.2, 1.6, 1.0, 2.4], "arrivals": [14.8, 20.0, 8.8]}, {"id": 192, "times": [17.8, 2.7, 1.4, 1.5, 7.1, 1.5, 30.7, 2.0], "arrivals": [10.6, 16.7, 10.0]}, {"id": 193, "times": [3.0, 2.2, 1.4, 1.3, 2.3, 1.6, 1.4, 1.9], "arrivals": [10.2, 27.0, 9.7]}, {"id": 194, "times": [2.8, 2.2, 1.3, 1.8, 1.9, 1.5, 1.3, 2.3], "arrivals": [14.2, 17.1, 10.4]}, {"id": 195, "times": [3.2, 2.0, 1.6, 1.3, 2.1, 1.4, 1.7, 1.8], "arrivals": [8.6, 13.6, 10.9]}, {"id": 196, "times": [20.2, 1.9, 1.8, 1.4, 6.9, 1.3, 34.5, 2.0], "arrivals": [9.0, 19.3, 9.2]}, {"id": 197, "times": [2.9, 2.3, 1.6, 1.2, 1.9, 1.2, 1.5, 2.1], "arrivals": [12.4, 6.6, 11.4]}, {"id": 198, "times": [20.1, 2.1, 1.3, 1.7, 6.7, 1.5, 31.8, 2.5], "arrivals": [10.1, 13.5, 10.6]}, {"id": 199, "times": [2.9, 2.3, 1.6, 1.6, 1.9, 1.5, 1.1, 2.0], "arrivals": [11.0, 5.8, 8.0]}, {"id": 200, "times": [3.1, 1.9, 1.6, 1.4, 2.0, 1.3, 1.3, 1.5], "arrivals": [10.6, 8.1, 8.0]}, {"id": 201, "times": [18.7, 2.1, 1.9, 1.2, 6.7, 1.5, 39.0, 2.2], "arrivals": [11.7, 21.3, 10.5]}, {"id": 202, "times": [3.2, 2.3, 1.4, 1.4, 1.9, 1.5, 1.1, 1.9], "arrivals": [14.1, 19.1, 10.2]}, {"id": 203, "times": [18.3, 2.4, 1.5, 1.2, 6.4, 1.2, 29.9, 2.1], "arrivals": [11.2, 11.7, 10.4]}, {"id": 204, "times": [3.1, 2.4, 1.9, 1.6, 2.4, 1.4, 1.4, 2.1], "arrivals": [12.4, 8.1, 10.5]}, {"id": 205, "times": [3.4, 2.0, 1.7, 1.5, 1.9, 1.6, 1.8, 2.0], "arrivals": [6.5, 30.0, 10.8]}, {"id": 206, "times": [2.9, 2.5, 1.7, 1.4, 2.2, 1.6, 1.7, 2.3], "arrivals": [10.9, 12.5, 11.7]}, {"id": 207, "times": [3.3, 2.1, 1.6, 1.0, 1.9, 1.3, 1.4, 1.7], "arrivals": [9.1, 26.1, 9.1]}, {"id": 208, "times": [2.8, 2.4, 1.6, 1.3, 2.0, 1.5, 1.8, 2.0], "arrivals": [8.3, 17.0, 9.0]}, {"id": 209, "times": [2.6, 2.3, 1.7, 1.5, 1.6, 1.7, 1.4, 2.3], "arrivals": [9.1, 12.4, 9.1]}, {"id": 210, "times": [18.0, 2.0, 1.5, 1.6, 7.3, 1.6, 29.3, 1.9], "arrivals": [10.3, 17.1, 10.9]}, {"id": 211, "times": [16.9, 2.2, 1.7, 1.6, 7.2, 1.5, 29.3, 1.7], "arrivals": [13.0, 29.5, 12.1]}, {"id": 212, "times": [2.9, 2.4, 1.4, 1.2, 2.2, 1.4, 1.7, 2.3], "arrivals": [8.1, 13.6, 9.9]}, {"id": 213, "times": [3.4, 2.4, 1.6, 1.4, 1.9, 1.4, 1.4, 2.4], "arrivals": [11.1, 15.5, 7.2]}, {"id": 214, "times": [2.4, 2.3, 1.6, 1.6, 2.2, 1.6, 1.3, 2.1], "arrivals": [9.9, 14.6, 8.3]}, {"id": 215, "times": [2.6, 2.6, 1.5, 1.2, 2.0, 1.5, 1.5, 1.6], "arrivals": [10.3, 18.6, 9.4]}, {"id": 216, "times": [16.4, 2.5, 1.6, 1.4, 7.2, 1.6, 27.3, 2.3], "arrivals": [13.2, 16.6, 9.8]}, {"id": 217, "times": [3.0, 2.2, 1.5, 1.4, 1.9, 1.5, 1.4, 1.7], "arrivals": [12.2, 28.2, 10.0]}, {"id": 218, "times": [2.9, 2.5, 1.4, 1.4, 2.4, 1.6, 1.6, 2.2], "arrivals": [13.9, 25.2, 10.6]}, {"id": 219, "times": [3.4, 2.7, 1.5, 1.1, 1.8, 1.5, 1.4, 1.9], "arrivals": [10.7, 24.9, 10.1]}, {"id": 220, "times": [3.3, 2.7, 1.4, 1.4, 1.7, 1.6, 1.6, 1.8], "arrivals": [9.5, 22.5, 11.9]}, {"id": 221, "times": [16.7, 2.0, 1.6, 1.4, 7.0, 1.6, 28.7, 2.0], "arrivals": [10.5, 10.5, 9.6]}, {"id": 222, "times": [3.0, 2.1, 1.4, 1.4, 2.4, 1.4, 1.5, 2.1], "arrivals": [11.5, 10.9, 9.4]}, {"id": 223, "times": [3.1, 2.6, 1.7, 1.3, 2.1, 1.2, 1.4, 1.9], "arrivals": [11.4, 21.1, 11.1]}, {"id": 224, "times": [19.2, 2.1, 1.4, 1.3, 6.9, 1.7, 33.4, 2.2], "arrivals": [8.6, 24.4, 8.5]}, {"id": 225, "times": [18.5, 2.0, 1.5, 1.4, 7.2, 1.5, 27.5, 2.0], "arrivals": [11.2, 21.5, 11.0]}, {"id": 226, "times": [2.7, 2.2, 1.5, 1.5, 2.0, 1.2, 1.9, 2.3], "arrivals": [11.5, 13.0, 10.6]}, {"id": 227, "times": [3.3, 2.4, 1.8, 1.4, 2.3, 1.4, 1.7, 2.2], "arrivals": [16.5, 30.0, 10.3]}, {"id": 228, "times": [3.4, 2.3, 1.6, 1.3, 1.6, 1.6, 1.7, 1.9], "arrivals": [15.1, 15.6, 12.6]}, {"id": 229, "times": [3.1, 2.2, 1.6, 1.4, 1.8, 1.5, 2.1, 1.9], "arrivals": [9.1, 16.2, 9.7]}, {"id": 230, "times": [2.9, 2.2, 1.7, 1.1, 1.8, 1.4, 1.6, 1.7], "arrivals": [10.4, 22.2, 13.2]}, {"id": 231, "times": [15.9, 2.1, 1.3, 1.5, 6.1, 1.7, 27.4, 2.2], "arrivals": [7.8, 13.3, 10.2]}, {"id": 232, "times": [15.7, 2.1, 1.6, 1.4, 6.7, 1.3, 34.8, 2.0], "arrivals": [9.7, 10.7, 8.8]}, {"id": 233, "times": [3.1, 2.8, 1.9, 1.4, 1.8, 1.4, 1.3, 1.5], "arrivals": [11.7, 12.9, 10.6]}, {"id": 234, "times": [3.0, 2.4, 1.6, 1.5, 2.0, 1.5, 1.4, 2.0], "arrivals": [13.7, 17.1, 9.1]}, {"id": 235, "times": [3.0, 2.5, 1.6, 1.1, 2.4, 1.6, 1.4, 1.9], "arrivals": [9.4, 7.8, 9.5]}, {"id": 236, "times": [3.2, 2.2, 1.7, 1.1, 1.8, 1.6, 1.6, 2.5], "arrivals": [9.6, 17.9, 11.0]}, {"id": 237, "times": [3.0, 2.3, 1.7, 1.4, 1.8, 1.6, 1.5, 1.7], "arrivals": [6.3, 24.1, 11.2]}, {"id": 238, "times": [17.6, 2.1, 1.3, 1.4, 7.7, 1.5, 33.4, 1.7], "arrivals": [10.6, 20.3, 9.7]}, {"id": 239, "times": [3.0, 1.7, 1.3, 1.4, 2.1, 1.6, 1.7, 2.4], "arrivals": [8.7, 4.0, 11.8]}, {"id": 240, "times": [3.0, 2.0, 1.6, 1.3, 1.8, 1.5, 1.7, 2.4], "arrivals": [9.8, 11.4, 12.0]}, {"id": 241, "times": [20.9, 1.9, 1.5, 1.5, 7.3, 1.5, 35.9, 1.9], "arrivals": [9.1, 7.2, 12.4]}, {"id": 242, "times": [3.0, 1.8, 1.8, 1.5, 2.1, 1.5, 1.4, 1.9], "arrivals": [10.8, 11.2, 11.2]}, {"id": 243, "times": [3.3, 2.0, 1.6, 1.5, 2.0, 1.5, 1.7, 2.3], "arrivals": [7.1, 16.1, 12.3]}, {"id": 244, "times": [2.7, 2.6, 1.3, 1.4, 1.5, 1.6, 1.7, 1.5], "arrivals": [7.8, 14.2, 8.1]}, {"id": 245, "times": [3.1, 2.3, 1.4, 1.1, 1.7, 1.6, 1.2, 1.6], "arrivals": [15.7, 13.8, 10.1]}, {"id": 246, "times": [3.4, 2.6, 1.2, 1.5, 2.2, 1.5, 1.4, 2.0], "arrivals": [8.2, 14.3, 9.4]}, {"id": 247, "times": [2.5, 2.4, 1.6, 1.6, 2.0, 1.4, 1.5, 2.5], "arrivals": [8.6, 15.9, 10.7]}, {"id": 248, "times": [3.1, 2.5, 1.6, 1.5, 1.7, 1.5, 1.7, 2.0], "arrivals": [15.0, 10.4, 9.8]}, {"id": 249, "times": [2.8, 2.1, 1.5, 1.3, 1.9, 1.5, 1.7, 2.1], "arrivals": [17.4, 18.3, 10.3]}, {"id": 250, "times": [2.9, 2.4, 1.8, 1.5, 1.9, 1.5, 1.6, 2.4], "arrivals": [8.4, 18.0, 12.9]}, {"id": 251, "times": [16.6, 2.5, 1.8, 1.5, 7.8, 1.8, 32.7, 2.6], "arrivals": [10.2, 16.8, 10.3]}, {"id": 252, "times": [2.9, 2.2, 1.6, 1.6, 1.6, 1.4, 1.5, 2.0], "arrivals": [11.8, 26.5, 11.0]}, {"id": 253, "times": [3.6, 2.4, 1.3, 1.3, 1.7, 1.6, 1.4, 2.1], "arrivals": [14.8, 26.4, 10.2]}, {"id": 254, "times": [2.6, 2.4, 1.7, 1.4, 2.0, 1.7, 1.4, 2.6], "arrivals": [8.8, 24.4, 10.6]}, {"id": 255, "times": [2.6, 2.2, 1.7, 1.5, 1.9, 1.5, 1.5, 1.7], "arrivals": [10.5, 14.6, 10.5]}, {"id": 256, "times": [2.6, 2.1, 1.6, 1.4, 2.0, 1.9, 1.5, 2.4], "arrivals": [12.7, 13.6, 11.1]}, {"id": 257, "times": [3.5, 2.0, 1.7, 1.2, 1.7, 1.4, 1.1, 1.8], "arrivals": [12.0, 11.5, 12.0]}, {"id": 258, "times": [2.9, 2.3, 1.4, 1.5, 2.0, 1.5, 1.4, 2.1], "arrivals": [10.2, 10.3, 12.6]}, {"id": 259, "times": [3.0, 2.4, 1.9, 1.5, 2.1, 1.4, 1.5, 2.0], "arrivals": [10.7, 9.3, 10.9]}, {"id": 260, "times": [2.9, 2.1, 1.5, 1.4, 2.0, 1.4, 1.4, 1.9], "arrivals": [8.0, 10.9, 11.3]}, {"id": 261, "times": [2.7, 2.3, 1.7, 1.4, 1.9, 1.5, 1.5, 1.9], "arrivals": [10.5, 14.7, 9.0]}, {"id": 262, "times": [16.2, 2.4, 1.3, 1.4, 7.5, 1.6, 26.4, 2.2], "arrivals": [10.4, 16.5, 10.4]}, {"id": 263, "times": [17.7, 2.4, 1.5, 1.6, 7.2, 1.5, 33.1, 2.3], "arrivals": [11.5, 15.2, 11.7]}, {"id": 264, "times": [19.2, 2.6, 1.8, 1.3, 5.9, 1.7, 35.9, 2.1], "arrivals": [9.8, 11.5, 11.6]}, {"id": 265, "times": [2.7, 2.6, 1.6, 1.3, 2.2, 1.5, 1.4, 2.1], "arrivals": [12.0, 28.5, 10.8]}, {"id": 266, "times": [3.2, 2.1, 1.7, 1.4, 1.9, 1.5, 1.7, 2.2], "arrivals": [13.2, 18.4, 11.7]}, {"id": 267, "times": [2.8, 2.7, 1.6, 1.5, 1.7, 1.9, 1.8, 1.9], "arrivals": [11.3, 27.2, 11.1]}, {"id": 268, "times": [2.5, 2.2, 1.6, 1.2, 1.8, 1.6, 1.7, 2.3], "arrivals": [11.8, 12.0, 12.1]}, {"id": 269, "times": [3.3, 2.5, 1.8, 1.2, 1.9, 1.4, 1.2, 2.3], "arrivals": [11.1, 17.5, 10.9]}, {"id": 270, "times": [3.3, 2.3, 1.6, 1.1, 1.8, 1.4, 1.5, 2.8], "arrivals": [11.0, 15.9, 10.0]}, {"id": 271, "times": [3.3, 2.2, 1.3, 1.4, 2.0, 1.4, 1.6, 2.0], "arrivals": [9.4, 26.7, 10.9]}, {"id": 272, "times": [16.8, 1.9, 1.5, 1.2, 7.0, 1.6, 32.6, 2.0], "arrivals": [11.7, 14.7, 6.7]}, {"id": 273, "times": [2.9, 2.3, 1.7, 1.3, 2.1, 1.4, 1.6, 2.3], "arrivals": [10.8, 16.2, 11.0]}, {"id": 274, "times": [3.2, 2.0, 1.7, 1.5, 2.2, 1.5, 1.3, 2.3], "arrivals": [15.6, 10.9, 5.8]}, {"id": 275, "times": [19.6, 2.5, 1.4, 1.3, 6.8, 1.5, 33.3, 2.0], "arrivals": [14.5, 15.9, 8.3]}, {"id": 276, "times": [2.9, 2.6, 1.5, 1.4, 1.7, 1.6, 1.6, 2.0], "arrivals": [11.8, 8.3, 11.1]}, {"id": 277, "times": [2.5, 2.1, 1.5, 1.4, 1.7, 1.4, 1.7, 2.2], "arrivals": [9.3, 21.1, 11.1]}, {"id": 278, "times": [3.0, 2.4, 1.5, 1.5, 1.9, 1.3, 1.3, 1.9], "arrivals": [8.6, 20.7, 9.0]}, {"id": 279, "times": [18.5, 2.1, 1.4, 1.5, 8.1, 1.5, 28.4, 2.0], "arrivals": [13.6, 13.8, 9.6]}, {"id": 280, "times": [2.6, 2.2, 1.5, 1.3, 1.7, 1.6, 1.0, 2.1], "arrivals": [11.6, 16.7, 12.3]}, {"id": 281, "times": [15.9, 2.5, 1.5, 1.4, 7.8, 1.5, 31.7, 2.3], "arrivals": [12.1, 3.9, 9.9]}, {"id": 282, "times": [3.1, 2.3, 1.7, 1.6, 1.8, 1.4, 1.4, 1.9], "arrivals": [7.2, 9.7, 13.4]}, {"id": 283, "times": [3.2, 2.7, 1.7, 1.5, 1.8, 1.6, 1.3, 1.6], "arrivals": [13.0, 13.6, 10.5]}, {"id": 284, "times": [3.3, 2.2, 1.6, 1.2, 1.8, 1.4, 1.5, 1.6], "arrivals": [12.0, 10.1, 11.0]}, {"id": 285, "times": [17.7, 2.5, 1.5, 1.5, 7.7, 1.4, 36.5, 1.8], "arrivals": [8.6, 18.3, 12.6]}, {"id": 286, "times": [2.5, 2.3, 1.6, 1.2, 1.9, 1.4, 1.0, 1.8], "arrivals": [10.0, 24.2, 10.7]}, {"id": 287, "times": [2.8, 2.5, 1.5, 1.6, 2.4, 1.7, 1.5, 2.1], "arrivals": [11.6, 9.6, 9.2]}, {"id": 288, "times": [17.1, 2.2, 1.4, 1.6, 7.5, 1.6, 32.6, 1.8], "arrivals": [11.1, 11.1, 10.4]}, {"id": 289, "times": [2.8, 2.3, 1.5, 1.4, 1.8, 1.6, 1.6, 1.9], "arrivals": [10.4, 16.1, 10.5]}, {"id": 290, "times": [2.8, 2.3, 1.5, 1.4, 1.9, 1.7, 1.2, 1.9], "arrivals": [10.8, 22.4, 8.7]}, {"id": 291, "times": [2.5, 2.1, 1.4, 1.4, 2.0, 1.9, 1.5, 2.0], "arrivals": [10.4, 9.4, 10.2]}, {"id": 292, "times": [3.5, 2.4, 1.6, 1.5, 2.0, 1.2, 1.4, 2.4], "arrivals": [11.3, 16.1, 9.5]}, {"id": 293, "times": [18.2, 2.4, 1.7, 1.3, 6.7, 1.4, 37.3, 2.3], "arrivals": [14.2, 25.4, 11.7]}, {"id": 294, "times": [3.2, 2.4, 1.4, 1.4, 1.7, 1.4, 1.5, 2.1], "arrivals": [5.4, 7.4, 10.5]}, {"id": 295, "times": [17.5, 2.6, 1.6, 1.5, 7.2, 1.4, 31.3, 2.0], "arrivals": [10.5, 9.1, 10.1]}, {"id": 296, "times": [18.6, 2.6, 1.6, 1.3, 7.2, 1.3, 29.0, 2.0], "arrivals": [11.4, 13.1, 10.4]}, {"id": 297, "times": [2.9, 2.2, 1.7, 1.3, 1.6, 1.5, 1.2, 2.2], "arrivals": [11.7, 12.6, 10.8]}, {"id": 298, "times": [21.1, 2.4, 1.6, 1.2, 6.9, 1.3, 31.3, 2.2], "arrivals": [10.2, 18.7, 11.3]}, {"id": 299, "times": [2.9, 2.2, 1.4, 1.2, 2.2, 1.6, 1.5, 1.9], "arrivals": [7.1, 16.1, 9.2]}, {"id": 300, "times": [16.0, 2.3, 1.4, 1.1, 6.0, 1.5, 31.2, 2.1], "arrivals": [11.7, 24.8, 9.1]}];
const names = ['Prepare Table','Weigh Cashew','Seal Pack','Put Label','Check Quality','Pack Box','Move to Storage','Clean Table'];
const descriptions = [
['Meet the three inputs','This static overview introduces the sources: a tray of roasted cashews, 20 empty pouches delivered by cart, and one folded carton. It is not an activity in the measured cycle. Next shows how the worker checks readiness.'],
['Are all three ready?','This is a decision, not a mandatory extra task. Watch the tray and carton arrive, then remain waiting for the pouches. Only when the last missing input arrives can preparation begin.'],
['1 / Prepare the table','The worker places the tray, unpacks the 20 small pouches, and positions the carton. These are tasks at one packing bench, not separate rooms.'],
['2 / Weigh the cashews','Use the scale to portion 150 g into each pouch. This batch uses 20 pouches: 3 kg of cashews in total. The recorded weighing time covers the whole batch.'],
['3 / Seal every pouch','The worker uses the tabletop sealer to close the filled pouches. All 20 are sealed before the batch moves on to labeling.'],
['4 / Put on the labels','Attach a label to each sealed pouch. The white label panels now appear on the packs. This is manual batch work, not an automated labeling line.'],
['5 / Check quality','Visually check each pack as described in the brief, including the weight and seal checks. Actual weighing is shown at the scale; a visual check alone cannot measure 150 g. No reject rate or rework path is supplied.'],
['6 / Pack the carton','Group the 20 checked pouches into one carton. Label the carton, close it and seal it. One carton—not one pouch—is the output of this work cycle.'],
['7 / Move to storage','The same worker carries the sealed carton to the adjacent finished-goods area. While that worker is moving the box, they are not packing another batch. The route is illustrative.'],
['8 / Return and clean','The worker returns, clears the bench and gets it ready for the next carton. Clean Table is the final measured step. The next cycle still needs all three materials.']];

// Rich Industrial Engineering Step Telemetry (8 measured steps + 2 preparatory steps)
const IE_STEP_DATA = [
  {
    step: 0,
    name: 'Overview & Supply Architecture',
    stageName: 'Orientation 1/2',
    category: 'System Context',
    classification: 'Non-Value-Added (System Architecture)',
    classCode: 'NVA',
    leanWaste: 'None (System Context)',
    wasteCategory: 'None',
    standardTimeMin: 0,
    description: 'Static introduction of the three supply streams: roasted cashew batch, pouch bundle, and carton flat-pack.',
    ieFocus: 'Line balancing & staging synchronization. Establishes cellular layout context.',
    kaizen: 'Implement visual factory signage and dedicated floor staging boundaries for all incoming lots.'
  },
  {
    step: 1,
    name: 'Readiness & Input Synchronization',
    stageName: 'Orientation 2/2',
    category: 'Staging / Queue',
    classification: 'Non-Value-Added (Waiting)',
    classCode: 'NVA',
    leanWaste: 'Waiting (Material Starvation)',
    wasteCategory: 'Waiting',
    standardTimeMin: 0,
    description: 'Decision gate: worker verifies all three components have arrived before opening packaging lot.',
    ieFocus: 'Material synchronization. Waiting time occurs when batch delivery times are unsynchronized.',
    kaizen: 'Implement a 2-Bin Kanban pull system between roaster cooling tray, cart delivery, and packaging bench to eliminate starvation waiting.'
  },
  {
    step: 2,
    name: 'Prepare Table',
    stageName: 'Step 1/8 (Measured)',
    category: 'Workstation Setup',
    classification: 'Necessary Non-Value-Added (Setup)',
    classCode: 'NNVA',
    leanWaste: 'Motion (Reaching & Unpacking)',
    wasteCategory: 'Motion',
    standardTimeMin: 3.1,
    description: 'Worker retrieves cashew tray, unpacks 20 empty pouches, and positions shipping carton at bench.',
    ieFocus: '5S Organization & Point-of-Use staging. Setup time directly detracts from available packaging takt.',
    kaizen: 'Pre-collate pouch cassettes and gravity feed cartons from an ergonomic overhead rack (eliminates 1.2m of reach motion).'
  },
  {
    step: 3,
    name: 'Weigh Cashew',
    stageName: 'Step 2/8 (Measured)',
    category: 'Transformation',
    classification: 'Value-Added (Core Transformation)',
    classCode: 'VA',
    leanWaste: 'Motion / Overprocessing (Tare variation)',
    wasteCategory: 'Overprocessing',
    standardTimeMin: 2.3,
    description: 'Worker portions 150g (±2g tolerance) into each of the 20 food-grade foil pouches (3.0 kg batch total).',
    ieFocus: 'Target cycle time vs Takt. Tare consistency, scoop fill repeatability, and operator fatigue.',
    kaizen: 'Install an automated vibratory net-weigh multi-head filler with foot pedal trigger (reduces cycle time by ~45%).'
  },
  {
    step: 4,
    name: 'Seal Pack',
    stageName: 'Step 3/8 (Measured)',
    category: 'Transformation',
    classification: 'Value-Added (Core Transformation)',
    classCode: 'VA',
    leanWaste: 'Waiting / Motion (Sealer dwell time)',
    wasteCategory: 'Waiting',
    standardTimeMin: 1.6,
    description: 'Worker operates tabletop impulse heat sealer across 20 filled pouches to create hermetic seals.',
    ieFocus: 'Impulse heating dwell time (1.2s/pack) creates unavoidable thermal waiting. High repetitive motion on wrist.',
    kaizen: 'Upgrade to a continuous rotary band sealer with motorized infeed belt to convert batch sealing into flow production.'
  },
  {
    step: 5,
    name: 'Put Label',
    stageName: 'Step 4/8 (Measured)',
    category: 'Identification',
    classification: 'Necessary Non-Value-Added (Regulatory)',
    classCode: 'NNVA',
    leanWaste: 'Motion / Overprocessing (Manual peeling & alignment)',
    wasteCategory: 'Motion',
    standardTimeMin: 1.4,
    description: 'Worker peels and adheres product ID / nutritional / batch barcode labels onto each of the 20 packs.',
    ieFocus: 'Label peel cycle and alignment variability. Required for compliance, but customer values contents, not peeling time.',
    kaizen: 'Switch to pre-printed rollstock pouches or inline roll-feed automatic print-and-apply labeller.'
  },
  {
    step: 6,
    name: 'Check Quality',
    stageName: 'Step 5/8 (Measured)',
    category: 'Inspection',
    classification: 'Non-Value-Added (Inspection / Defect Catching)',
    classCode: 'NVA',
    leanWaste: 'Overprocessing (Classic Muda of Inspection)',
    wasteCategory: 'Overprocessing',
    standardTimeMin: 1.9,
    description: 'Worker visually inspects seal hermeticity, label orientation, and gross weight across all 20 units.',
    ieFocus: 'Lean axiom: Inspection does NOT create quality; it only detects failures after resource expenditure.',
    kaizen: 'Implement Poka-Yoke (fail-safe) inline optical sensor & pressure check on sealing bar to build quality at source.'
  },
  {
    step: 7,
    name: 'Pack Box',
    stageName: 'Step 6/8 (Measured)',
    category: 'Packaging',
    classification: 'Value-Added (Master Unitization)',
    classCode: 'VA',
    leanWaste: 'Motion (Manual boxing & taping)',
    wasteCategory: 'Motion',
    standardTimeMin: 1.5,
    description: 'Worker groups 20 validated pouches into carton, applies shipping label, and tapes top and bottom flaps.',
    ieFocus: 'Carton pack nesting pattern (4x5 array) and taping motion ergonomics.',
    kaizen: 'Use self-locking pop-up carton bottom or a semi-automatic top flap tape machine.'
  },
  {
    step: 8,
    name: 'Move to Storage',
    stageName: 'Step 7/8 (Measured)',
    category: 'Transportation',
    classification: 'Pure Non-Value-Added (Transportation Waste)',
    classCode: 'NVA',
    leanWaste: 'Transportation (Conveyance & Cell Starvation)',
    wasteCategory: 'Transportation',
    standardTimeMin: 7.2,
    description: 'Worker carries finished carton ~10 meters across doorway to storage pallet/rack and returns.',
    ieFocus: 'Major bottleneck & source of variance (spikes up to 38m in dataset). Packaging cell sits completely idle while worker walks.',
    kaizen: 'Install a gravity roller outfeed conveyor through wall port to storage rack, keeping operator inside the packing cell 100% of the time.'
  },
  {
    step: 9,
    name: 'Clean Table',
    stageName: 'Step 8/8 (Measured)',
    category: 'Sanitation',
    classification: 'Necessary Non-Value-Added (GMP Standard)',
    classCode: 'NNVA',
    leanWaste: 'Motion / Waiting (Return travel & wiping)',
    wasteCategory: 'Motion',
    standardTimeMin: 2.1,
    description: 'Worker clears crumbs, sanitizes stainless steel surface with food-grade disinfectant wipe for next carton.',
    ieFocus: 'Standard Operating Procedure (SOP) cycle time and frequency. GMP requirement in food processing.',
    kaizen: 'Optimize sanitation protocol: use crumb collection trough and perform full wet-wipe at batch lot changeover rather than each box.'
  }
];

window.factoryIEData = {
  steps: IE_STEP_DATA,
  targetTakt: 17.78,
  shiftMinutes: 480,
  targetDemandCartons: 27,
  benchmarks: {
    targetTakt: 17.78,
    overallMeanCycleTime: 25.4,
    datasetRecords: DATA.length,
    vaStepsCount: IE_STEP_DATA.filter((s) => s.classCode === 'VA').length,
    nvaStepsCount: IE_STEP_DATA.filter((s) => s.classCode === 'NVA').length,
    nnvaStepsCount: IE_STEP_DATA.filter((s) => s.classCode === 'NNVA').length
  },
  getBatchTelemetry: (batchIdx) => {
    let d = DATA[batchIdx] || DATA[0];
    let total = d.times.reduce((a, b) => a + b, 0);
    let maxTime = Math.max(...d.times);
    let bottleneckIdx = d.times.indexOf(maxTime);
    let vaTime = d.times[1] + d.times[2] + d.times[5];
    let nvaTime = d.times[4] + d.times[6];
    let nnvaTime = d.times[0] + d.times[3] + d.times[7];
    return {
      batchId: d.id,
      totalCycleTime: total,
      targetTakt: 17.78,
      taktDelta: +(total - 17.78).toFixed(2),
      isOverTakt: total > 17.78,
      bottleneckStep: names[bottleneckIdx],
      bottleneckTime: maxTime,
      vaTime: +vaTime.toFixed(2),
      nvaTime: +nvaTime.toFixed(2),
      nnvaTime: +nnvaTime.toFixed(2),
      vaRatioPercent: +((vaTime / total) * 100).toFixed(1)
    };
  },
  getCurrentStepTelemetry: (stepIdx, batchIdx) => {
    let d = DATA[batchIdx] || DATA[0];
    let total = d.times.reduce((a, b) => a + b, 0);
    let stepInfo = IE_STEP_DATA[stepIdx] || IE_STEP_DATA[0];
    let measuredTime = stepIdx >= 2 ? d.times[stepIdx - 2] : null;
    let maxTime = Math.max(...d.times);
    let isBottleneck = stepIdx >= 2 && measuredTime === maxTime;
    return {
      stepIndex: stepIdx,
      stepName: stepInfo.name,
      stageName: stepInfo.stageName,
      classification: stepInfo.classification,
      classCode: stepInfo.classCode,
      leanWaste: stepInfo.leanWaste,
      wasteCategory: stepInfo.wasteCategory,
      measuredTimeMin: measuredTime,
      totalCycleMin: total,
      targetTaktMin: 17.78,
      taktDeltaMin: +(total - 17.78).toFixed(2),
      isBottleneck,
      ieFocus: stepInfo.ieFocus,
      kaizen: stepInfo.kaizen
    };
  }
};

let step = 0;
let batch = 0;
let playing = false;
let lastTour = 0;
let wallHigh = false;
const $ = (s) => document.getElementById(s);

// Initialize options
DATA.forEach((d, i) => {
  let o = document.createElement('option');
  o.value = i;
  o.textContent = `Batch ${d.id}${i === 0 ? ' · short cycle' : i === 1 ? ' · long cycle' : ''}`;
  $('batch').appendChild(o);
});

descriptions.forEach((d, i) => {
  let b = document.createElement('button');
  b.title = d[0];
  b.setAttribute('aria-label', d[0]);
  b.onclick = () => setStep(i);
  $('steps').appendChild(b);
});

// 1. Initialize Scene Environment & Materials
const picks = [];
window.picks = picks;

const env = SceneEnvironment.createSceneEnvironment({
  canvas: $('scene'),
  picks: picks,
  onInspect: (info) => {
    $('objectTitle').textContent = info.title;
    $('objectText').textContent = info.text;
  }
});

const scene = env.scene;
const camera = env.camera;
const renderer = env.renderer;
window.env = env;
window.scene = scene;
window.camera = camera;
window.renderer = renderer;

// Tagging helper
function tag(g, title, text) {
  g.traverse((o) => {
    if (o.isMesh) {
      o.userData.info = { title, text };
      picks.push(o);
    }
  });
  return g;
}

function box(x, y, z, w, h, d, c, parent = scene, metal = 0) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    EquipmentModels.getMaterial(c, metal ? 0.8 : 0.1, metal ? 0.3 : 0.7)
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

function cyl(x, y, z, r, h, c, parent = scene) {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(r, r, h, 16),
    EquipmentModels.getMaterial(c, 0.2, 0.6)
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

function group(x = 0, y = 0, z = 0) {
  let g = new THREE.Group();
  g.position.set(x, y, z);
  scene.add(g);
  return g;
}

function table(x, z, w = 3, d = 1.3) {
  let g = group(x, 0, z);
  box(0, 1, 0, w, 0.12, d, '#475569', g, 0.8);
  for (let xx of [-w / 2 + 0.15, w / 2 - 0.15]) {
    for (let zz of [-d / 2 + 0.12, d / 2 - 0.12]) {
      box(xx, 0.5, zz, 0.1, 1, 0.1, '#1e293b', g, 0.9);
    }
  }
  return g;
}

function carton(parent, x, y, z, closed = false) {
  return EquipmentModels.createCorrugatedCarton(parent, x, y, z, closed);
}

// 2. Initialize Upgraded Rich Mechanical Equipment Models
const eq = EquipmentModels.setupAllEquipment({ scene, picks });
window.eq = eq;

const roaster = eq.roaster;
const coolingTable = eq.coolingTable;
const packingBench = eq.packingBench;
const scale = eq.scale;
const sealer = eq.sealer;
const labeler = eq.labeler;
const pouchCart = eq.cart;
const cashewCart = eq.cashewCart || EquipmentModels.createUtilityCart({ scene, picks, title: 'Cashew delivery cart', text: 'Stainless steel mobile utility cart delivering the roasted cashew tray to the packaging station.' });
const cartonCart = eq.cartonCart || EquipmentModels.createUtilityCart({ scene, picks, title: 'Carton delivery cart', text: 'Mobile utility cart delivering the folded corrugated shipping carton.' });
eq.cashewCart = cashewCart;
eq.cartonCart = cartonCart;
const cart = pouchCart;

if (cashewCart.tray) cashewCart.tray.visible = false;
if (cartonCart.carton) cartonCart.carton.visible = false;
const pouchBundles = pouchCart.children.filter((c) => c.position && Math.abs(c.position.y - 1.10) < 0.05);

const storeRack1 = eq.storeRack1;
const storeRack2 = eq.storeRack2;
const supplyRack = eq.supplyRack;
const worker = eq.worker;
const tray = eq.benchTray;

// Adjust equipment station positions on bench (bench top surface y = 1.03)
scale.position.set(-3.2, 1.03, 4.0);
sealer.position.set(-0.9, 1.03, 3.7);
labeler.position.set(1.25, 1.03, 3.65);
tray.visible = false;

// Secondary tables: box folding table and landing table
const fold = table(4, -6.5, 3.5, 2);
carton(fold, -0.7, 1.06, 0, false);
box(0.8, 1.13, 0, 1, 0.15, 1.1, '#b58d5b', fold);
tag(fold, 'Box-folding table', 'Cartons are folded from flat stock at this secondary table before being brought to the packaging cell.');

const landing = table(11, 4, 2, 1.2);
tag(landing, 'Finished-carton landing table', 'Illustrative receiving surface inside the adjacent finished-goods storage area. The packing worker places the carton here, then returns through the opening.');

// 3. Dynamic Pouches & Carton Assembly
const pouches = group(0.10, 1.03, 4.08);
const packs = [];
for (let i = 0; i < 20; i++) {
  let col = (i % 4) - 1.5;
  let row = Math.floor(i / 4) - 2.0;
  // 4 columns spaced 0.19m apart, 5 rows spaced 0.16m apart (leaves clear 5-7cm gaps so every pack takes distinct 3D shape)
  let p = EquipmentModels.createStandupCoffeePouch({
    parent: pouches,
    x: col * 0.19,
    y: 0,
    z: row * 0.16,
    color: '#0284c7'
  });

  // Initial flat state for empty pouch
  p.body.scale.set(1.0, 0.18, 0.45);
  p.body.position.set(0, 0, 0);
  p.seam.position.set(0, 0.210 * 0.88 * 0.18, 0);
  p.label.position.set(0, 0.210 * 0.42 * 0.18, 0.095 * 0.52 * 0.45 + 0.002);
  p.label.scale.set(1.0, 0.18, 0.45);

  packs.push({ g: p.group, body: p.body, seam: p.seam, label: p.label });
}

let openBox = group(2.0, 1.03, 4.0);
let closedBox = group(2.0, 1.03, 4.0);
carton(openBox, 0, 0, 0, false);
carton(closedBox, 0, 0, 0, true);

// Delivered materials during Stage 1 & 2
const deliveredTray = EquipmentModels.createBenchTray({ scene, picks });
tag(deliveredTray, 'Delivered cashew tray', 'Tray of roasted cashews delivered by mobile supply cart.');
deliveredTray.visible = false;

const deliveredCarton = group();
carton(deliveredCarton, 0, 0, 0, false);
deliveredCarton.visible = false;

const scoop = group();
let bowl = cyl(0, 0, 0, 0.08, 0.08, '#94a3b8', scoop);
let handle = cyl(0, 0.1, 0, 0.02, 0.14, '#1e293b', scoop);
handle.position.set(0, 0.07, 0.05);
handle.rotation.x = 0.6;

const wipe = box(0, 1.04, 4.65, 0.28, 0.018, 0.2, '#38bdf8');

// Supply flow directional vector arrows
const arrows = group();
function arrow(a, b, c) {
  let v = new THREE.Vector3(...a);
  let e = new THREE.Vector3(...b);
  let dir = e.clone().sub(v);
  let ar = new THREE.ArrowHelper(dir.clone().normalize(), v, dir.length(), c, 0.45, 0.28);
  arrows.add(ar);
}
arrow([-10, 0.2, -1.8], [-10, 0.2, 1.6], 0xf59e0b); // Cashew flow from roaster
arrow([-10, 0.2, 1.6], [-2.8, 0.2, 1.6], 0xf59e0b);
arrow([-0.4, 0.2, -3.8], [-0.4, 0.2, 1.6], 0x06b6d4); // Pouch cart flow
arrow([4.0, 0.2, -6.0], [4.0, 0.2, 1.6], 0xd97706); // Carton flow
arrow([4.0, 0.2, 1.6], [2.0, 0.2, 1.6], 0xd97706);
arrow([8, 0.2, 5.2], [10.5, 0.2, 5.2], 0x38bdf8); // Out to storage
arrow([10.5, 0.2, 4.8], [8, 0.2, 4.8], 0x38bdf8); // Worker return

// Worker active position indicator ring
const ring = new THREE.Mesh(
  new THREE.TorusGeometry(0.65, 0.035, 8, 48),
  new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
);
ring.rotation.x = Math.PI / 2;
scene.add(ring);

// 4. Camera View Controls
function view(v, smooth = true) {
  for (let id of ['overview', 'bench', 'top', 'walk']) {
    const el = $(id);
    if (el) el.classList.toggle('on', id === v);
  }
  const topWalkBtn = $('topWalkBtn');
  if (topWalkBtn) topWalkBtn.classList.toggle('active', v === 'walk');
  env.view(v, smooth);
}

if ($('overview')) $('overview').onclick = () => view('overview');
if ($('bench')) $('bench').onclick = () => view('bench');
if ($('top')) $('top').onclick = () => view('top');
const walkBtn = $('walk');
if (walkBtn) walkBtn.onclick = () => view('walk');
const topWalkBtn = $('topWalkBtn');
if (topWalkBtn) topWalkBtn.onclick = () => {
  if (env.cameraController && env.cameraController.toggleWalkMode) {
    env.cameraController.toggleWalkMode();
  } else {
    view('walk');
  }
};

$('walls').onclick = () => {
  wallHigh = env.toggleWalls();
  $('walls').textContent = wallHigh ? 'Walls: full' : 'Walls: low';
  $('walls').classList.toggle('on', wallHigh);
};

$('flows').onclick = () => {
  arrows.visible = !arrows.visible;
  $('flows').classList.toggle('on', arrows.visible);
};

$('labels').onclick = () => {
  env.signs.visible = !env.signs.visible;
  $('labels').classList.toggle('on', env.signs.visible);
};

const markingsBtn = $('markings');
if (markingsBtn) {
  markingsBtn.onclick = () => {
    env.markings.visible = !env.markings.visible;
    markingsBtn.classList.toggle('on', env.markings.visible);
  };
}

const shadowsBtn = $('shadows');
if (shadowsBtn) {
  shadowsBtn.onclick = () => {
    env.lights.sun.castShadow = !env.lights.sun.castShadow;
    renderer.shadowMap.enabled = env.lights.sun.castShadow;
    shadowsBtn.classList.toggle('on', env.lights.sun.castShadow);
  };
}

$('shot').onclick = () => {
  renderer.render(scene, camera);
  let a = document.createElement('a');
  a.download = 'cashew-factory-digital-twin.png';
  a.href = renderer.domElement.toDataURL('image/png');
  a.click();
};

const exportHeaderBtn = $('exportHeaderBtn');
if (exportHeaderBtn) {
  exportHeaderBtn.onclick = () => $('shot').click();
}

// 5. Navigation & Step Management
function setStep(s, force = false) {
  if (!force && step === 1 && s === 2 && motionTime < 9600) return;
  motionTime = 0;
  step = Math.max(0, Math.min(9, s));
  lastTour = performance.now();
  update();
}

function update() {
  let d = DATA[batch];
  let total = d.times.reduce((a, b) => a + b, 0);

  $('stepnum').textContent = step < 2 ? `Orientation · ${step + 1} / 2` : `Measured process · ${step - 1} / 8`;
  $('title').textContent = descriptions[step][0];
  $('explain').textContent = descriptions[step][1];

  [...$('steps').children].forEach((b, i) => b.classList.toggle('on', i === step));

  $('duration').innerHTML = step < 2
    ? `${total.toFixed(1)} <small>min / whole cycle</small>`
    : `${d.times[step - 2].toFixed(1)} <small>min / this step</small>`;

  $('arrivals').innerHTML = `<div class="legend" style="margin-top:6px;gap:8px;font-size:11px">
    <span style="--c:#f59e0b">Cashews <strong>${d.arrivals[0]}</strong></span>
    <span style="--c:#06b6d4">Pouches <strong>${d.arrivals[1]}</strong></span>
    <span style="--c:#d97706">Carton <strong>${d.arrivals[2]}</strong></span>
  </div>`;

  $('bars').innerHTML = '';
  names.forEach((n, i) => {
    let t = d.times[i];
    let row = document.createElement('div');
    row.className = 'barrow' + (step === i + 2 ? ' active' : '');
    row.innerHTML = `<span>${n}</span><div class="bar"><i style="width:${(t / 20) * 100}%"></i></div><span>${t.toFixed(1)}</span>`;
    $('bars').appendChild(row);
  });

  let ie = window.factoryIEData ? window.factoryIEData.getCurrentStepTelemetry(step, batch) : null;
  if ($('lesson')) {
    $('lesson').textContent = step === 8 && d.times[6] > 10
      ? `Notice: storage is adjacent, but this recorded move takes ${d.times[6]} minutes.`
      : step === 1
      ? 'Readiness rule: tray, 20 pouches, and 1 carton must all arrive before packing begins.'
      : `Batch ${d.id}: ${total.toFixed(1)} min/carton · Target pace: 17.78 min/carton.`;
  }

  closedBox.position.set(step >= 8 ? 11.0 : 2.0, step >= 8 ? 1.07 : 1.03, 4.0);
  closedBox.visible = step >= 8;
  openBox.position.set(2.0, 1.03, 4.0);
  openBox.visible = step >= 2 && step <= 7;

  if (step < 2) {
    tray.visible = false;
  } else if (step >= 2 && step <= 7) {
    tray.visible = true;
    if (step !== 2) {
      tray.position.set(-2.1, 1.03, 4.4);
    }
  } else {
    tray.visible = false;
  }

  if (coolingTable && coolingTable.nuts) {
    coolingTable.nuts.forEach((n) => (n.visible = step < 4));
  }
  pouches.visible = step >= 2 && step <= 7;
  if (worker.carry) worker.carry.visible = false;

  let spots = [
    [-2.0, 5.8],  // Step 0: Overview
    [-2.0, 5.8],  // Step 1: Readiness
    [-0.5, 5.35], // Step 2: Prepare Table
    [-2.7, 5.35], // Step 3: Weigh Cashew
    [-0.9, 5.35], // Step 4: Seal Pack
    [0.8, 5.35],  // Step 5: Put Label
    [0.8, 5.35],  // Step 6: Check Quality
    [2.0, 5.35],  // Step 7: Pack Box
    [2.0, 5.35],  // Step 8: Move to Storage
    [2.0, 5.35]   // Step 9: Clean Table
  ];
  worker.position.set(spots[step][0], 0, spots[step][1]);
  worker.rotation.y = step === 8 ? Math.PI / 2 : Math.PI;

  $('prev').disabled = step === 0;
  $('play').textContent = playing ? 'Pause tour' : 'Play tour';

  window.factoryState = {
    step,
    batch: d.id,
    total,
    packCount: 20,
    recordCount: DATA.length,
    rendered: false,
    ie
  };

  if (typeof window.onFactoryStepChange === 'function') {
    window.onFactoryStepChange(step, d, total, ie);
  }
  if (typeof window.onStepChange === 'function') {
    window.onStepChange(ie);
  }

  renderMotion(motionTime);
}

$('prev').onclick = () => setStep(step - 1);
$('next').onclick = () => setStep(step === 9 ? 0 : step + 1);

$('batch').onchange = (e) => {
  batch = +e.target.value;
  motionTime = 0;
  update();
};

$('play').onclick = () => {
  playing = !playing;
  $('play').textContent = playing ? '⏸ PAUSE TOUR' : '▶ PLAY TOUR';
  $('play').classList.toggle('primary', !playing);
  $('play').classList.toggle('btn-brutal-primary', !playing);
  if (playing) {
    motionPaused = false;
    if (motionButton) {
      motionButton.textContent = 'Pause motion';
      motionButton.classList.remove('on');
    }
    if (step === 9 && motionTime >= 11800) {
      setStep(0, true);
    }
  }
};

// 6. Interactive Raycasting Click Inspector
const ray = new THREE.Raycaster();
let drag = null;

renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

renderer.domElement.addEventListener('pointerdown', (e) => {
  drag = {
    x: e.clientX,
    y: e.clientY,
    startX: e.clientX,
    startY: e.clientY,
    button: e.button
  };
  renderer.domElement.setPointerCapture(e.pointerId);
});

renderer.domElement.addEventListener('pointerup', (e) => {
  if (drag && Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) < 5) {
    let r = renderer.domElement.getBoundingClientRect();
    ray.setFromCamera(
      new THREE.Vector2(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      ),
      camera
    );
    let hit = ray.intersectObjects(picks).find((h) => {
      let o = h.object;
      while (o) {
        if (!o.visible) return false;
        o = o.parent;
      }
      return true;
    });
    if (hit) {
      $('objectTitle').textContent = hit.object.userData.info.title;
      $('objectText').textContent = hit.object.userData.info.text;
    }
  }
  drag = null;
});

renderer.domElement.addEventListener('pointercancel', () => (drag = null));

// Window resizing
function resize() {
  env.resize();
}
window.addEventListener('resize', resize);
  resize();

// 7. Deterministic Kinematic Animation Engine
let motionTime = 0;
let motionPaused = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lastFrame = null;

const motionButton = $('motion') || (() => {
  const el = document.createElement('button');
  el.id = 'motion';
  el.className = 'dock-btn';
  el.title = 'Stop / Resume Motion (Space)';
  el.textContent = motionPaused ? 'Resume motion' : 'Pause motion';
  if ($('shot') && $('shot').parentElement) $('shot').parentElement.appendChild(el);
  return el;
})();

function updateMotionButton() {
  if (!motionButton) return;
  motionButton.textContent = motionPaused ? 'Resume motion' : 'Pause motion';
  motionButton.classList.toggle('on', !motionPaused);
}

motionButton.onclick = () => {
  motionPaused = !motionPaused;
  updateMotionButton();
};
updateMotionButton();

const progress = $('activity') || (() => {
  const el = document.createElement('div');
  el.className = 'note';
  el.id = 'activity';
  if ($('explain') && $('explain').parentElement) {
    $('explain').parentElement.insertBefore(el, $('explain').nextSibling);
  }
  return el;
})();

const scrub = $('scrub') || (() => {
  const el = document.createElement('input');
  el.type = 'range';
  el.min = 0;
  el.max = 12000;
  el.value = 0;
  el.id = 'scrub';
  el.style.width = '100%';
  el.style.margin = '10px 0';
  if ($('play') && $('play').parentElement && $('play').parentElement.parentElement) {
    $('play').parentElement.parentElement.insertBefore(el, $('play').parentElement);
  }
  return el;
})();
scrub.oninput = (e) => {
  motionPaused = true;
  updateMotionButton();
  motionTime = +e.target.value;
  renderMotion(motionTime);
};

const replay = $('replay') || (() => {
  const el = document.createElement('button');
  el.textContent = 'Replay this action';
  el.id = 'replay';
  el.className = 'btn-brutal';
  if ($('play') && $('play').parentElement) $('play').parentElement.appendChild(el);
  return el;
})();
replay.onclick = () => {
  motionTime = 0;
  motionPaused = false;
  updateMotionButton();
};

const readiness = $('readiness') || (() => {
  const el = document.createElement('div');
  el.id = 'readiness';
  el.className = 'note';
  el.hidden = true;
  if ($('explain') && $('explain').parentElement) {
    $('explain').parentElement.insertBefore(el, $('explain').nextSibling);
  }
  return el;
})();
$('explain').parentElement.insertBefore(readiness, $('explain').nextSibling);

const jaw = eq.sealer.jaw;
const armPivots = eq.worker.armPivots || [];
const legs = eq.worker.legs || [];

const waypoints = [
  [2.0, 0, 5.35],
  [6.4, 0, 5.35],
  [11.0, 0, 5.2]
];

const basePositions = packs.map((p) => p.g.position.clone());
let lastCaption = '';

function clamp(v) {
  return Math.max(0, Math.min(1, v));
}

function lerp3(a, b, t) {
  return new THREE.Vector3(...a).lerp(new THREE.Vector3(...b), clamp(t));
}

function pathPoint(points, t) {
  let lengths = points.slice(1).map((p, i) => new THREE.Vector3(...p).distanceTo(new THREE.Vector3(...points[i])));
  let total = lengths.reduce((a, b) => a + b, 0);
  let dist = clamp(t) * total;
  let acc = 0;
  for (let i = 0; i < lengths.length; i++) {
    if (dist <= acc + lengths[i] || i === lengths.length - 1) {
      let segT = lengths[i] === 0 ? 0 : (dist - acc) / lengths[i];
      return new THREE.Vector3(...points[i]).lerp(new THREE.Vector3(...points[i + 1]), segT);
    }
    acc += lengths[i];
  }
  return new THREE.Vector3(...points[points.length - 1]);
}

function renderMotion(ms) {
  let t = clamp(ms / 12000);
  let u = t * 20;
  let index = Math.min(19, Math.floor(u));
  let f = u - index;
  scene.updateMatrixWorld(true);
  scrub.value = ms;

  cashewCart.position.set(-2.8, 0, 1.6);
  cashewCart.visible = true;
  pouchCart.position.set(-0.4, 0, 1.6);
  pouchCart.visible = true;
  cartonCart.position.set(2.0, 0, 1.6);
  cartonCart.visible = true;
  pouchBundles.forEach((b) => (b.visible = step < 2));

  deliveredTray.visible = false;
  deliveredCarton.visible = false;
  scoop.visible = false;
  wipe.visible = false;

  if (step < 2) {
    tray.visible = false;
  } else if (step >= 2 && step <= 7) {
    tray.visible = true;
    if (step !== 2) {
      tray.position.set(-2.1, 1.03, 4.4);
    }
  } else {
    tray.visible = false;
  }

  closedBox.visible = step >= 8;
  closedBox.position.set(step >= 8 ? 11.0 : 2.0, step >= 8 ? 1.07 : 1.03, 4.0);
  openBox.position.set(2.0, 1.03, 4.0);
  openBox.visible = step >= 2 && step <= 7;

  pouches.visible = step >= 2 && step <= 7;
  if (step !== 2) {
    pouches.position.set(0.10, 1.03, 4.08);
  }
  packs.forEach((p, i) => {
    p.g.position.copy(basePositions[i]);
    p.g.rotation.set(0, 0, 0);
    p.g.visible = true;
    p.label.visible = step > 5 || (step === 5 && i < index);
    p.seam.visible = step > 4 || (step === 4 && i < index);
    let filled = step > 3 || (step === 3 && i < index);
    let sy = filled ? 1.0 : 0.18;
    let sz = filled ? 1.0 : 0.45;
    p.body.scale.set(1.0, sy, sz);
    p.body.position.set(0, 0, 0);
    p.seam.position.set(0, 0.210 * 0.88 * sy, 0);
    p.label.position.set(0, 0.210 * 0.42 * sy, (0.095 * 0.52 * sz) + 0.002);
    p.label.scale.set(1.0, sy, sz);
  });

  let caption = 'Animation is illustrative; speed and delivery order are not measurements.';
  readiness.hidden = step !== 1;

  if (step === 0) {
    cashewCart.position.set(-10.0, 0, -1.8);
    cashewCart.visible = true;
    deliveredTray.position.set(-10.0, 0.865, -1.8);
    deliveredTray.visible = true;

    pouchCart.position.set(-0.4, 0, -3.8);
    pouchCart.visible = true;

    cartonCart.position.set(4.0, 0, -6.0);
    cartonCart.visible = true;
    deliveredCarton.position.set(4.0, 0.865, -6.0);
    deliveredCarton.visible = true;

    tray.visible = false;
    openBox.visible = false;
    closedBox.visible = false;
    pouches.visible = false;

    worker.position.set(-2.0, 0, 5.8);
    worker.rotation.y = Math.PI;
    if (worker.carry) worker.carry.visible = false;

    caption = 'Meet the three supply sources. Not a process step; no waiting happens on this overview. Choose Next to see the readiness rule.';
  }

  if (step === 1) {
    const cashewT = clamp(t / 0.25);
    const cashewPts = [[-10.0, 0, -1.8], [-10.0, 0, 1.6], [-2.8, 0, 1.6]];
    const cashewPos = pathPoint(cashewPts, cashewT);
    cashewCart.position.copy(cashewPos);
    cashewCart.visible = true;
    deliveredTray.position.set(cashewPos.x, 0.865, cashewPos.z);
    deliveredTray.visible = true;

    const cartonT = clamp((t - 0.20) / 0.25);
    const cartonPts = [[4.0, 0, -6.0], [4.0, 0, 1.6], [2.0, 0, 1.6]];
    const cartonPos = pathPoint(cartonPts, cartonT);
    cartonCart.position.copy(cartonPos);
    cartonCart.visible = true;
    deliveredCarton.position.set(cartonPos.x, 0.865, cartonPos.z);
    deliveredCarton.visible = true;

    const pouchT = clamp((t - 0.50) / 0.30);
    const pouchPts = [[-0.4, 0, -3.8], [-0.4, 0, 1.6]];
    const pouchPos = pathPoint(pouchPts, pouchT);
    pouchCart.position.copy(pouchPos);
    pouchCart.visible = true;

    const cashewReady = t >= 0.25;
    const cartonReady = t >= 0.45;
    const pouchReady = t >= 0.80;

    worker.position.set(-2.0, 0, 5.8);
    worker.rotation.y = Math.PI;
    if (worker.carry) worker.carry.visible = false;

    for (const [id, name, ready] of [
      ['cashews', 'Cashews', cashewReady],
      ['pouches', 'Pouches', pouchReady],
      ['carton', 'Carton', cartonReady]
    ]) {
      let el = $(id);
      if (el) {
        el.className = 'pill ' + (ready ? 'good' : 'bad');
        el.textContent = `${name}: ${ready ? 'Ready' : 'Waiting'}`;
      }
    }

    $('next').disabled = !pouchReady;
    $('next').textContent = pouchReady ? 'Begin Prepare Table →' : 'Waiting for inputs…';

    caption = pouchReady
      ? 'All three ready → Begin Prepare Table. No extra waiting step is required.'
      : cashewReady && cartonReady
      ? 'Cashews and carton are staged. Pouches have not arrived yet; Prepare Table cannot start.'
      : 'Waiting for all three inputs to reach the packing cell.';
  } else {
    $('next').disabled = false;
    $('next').textContent = step === 0 ? 'See readiness example →' : step === 9 ? 'Restart ↺' : 'Next →';
  }

  if (step === 2) {
    cashewCart.position.set(-2.8, 0, 1.6);
    cashewCart.visible = true;
    pouchCart.position.set(-0.4, 0, 1.6);
    pouchCart.visible = true;
    cartonCart.position.set(2.0, 0, 1.6);
    cartonCart.visible = true;

    deliveredTray.visible = false;
    deliveredCarton.visible = false;

    let trayPos = lerp3([-2.8, 0.865, 1.6], [-2.1, 1.03, 4.4], t);
    trayPos.y += Math.sin(t * Math.PI) * 0.35;
    tray.position.copy(trayPos);
    tray.visible = true;

    let boxPos = lerp3([2.0, 0.865, 1.6], [2.0, 1.03, 4.0], t);
    boxPos.y += Math.sin(t * Math.PI) * 0.35;
    openBox.position.copy(boxPos);
    openBox.visible = true;

    let pouchPos = lerp3([-0.4, 1.0, 1.6], [0.10, 1.03, 4.08], t);
    pouchPos.y += Math.sin(t * Math.PI) * 0.35;
    pouches.position.copy(pouchPos);
    pouches.visible = true;

    packs.forEach((p) => p.g.scale.setScalar(1));

    worker.position.set(-1.2 + t * 2.0, 0, 5.35);
    worker.rotation.y = Math.PI;
    if (worker.carry) worker.carry.visible = false;
    if (armPivots.length === 2) {
      armPivots[0].rotation.x = -0.45 + Math.sin(t * Math.PI * 3) * 0.15;
      armPivots[1].rotation.x = -0.55 + Math.sin(t * Math.PI * 3) * 0.15;
    }
    caption = 'Place cashew tray, empty packaging bundle, and folded carton onto the workstation.';
  } else {
    packs.forEach((p) => p.g.scale.setScalar(1));
  }

  if (step >= 3 && step <= 6) {
    let p = packs[index];
    let stationCoords;

    if (step === 3) {
      stationCoords = [-3.2, 1.10, 4.0];
      worker.position.set(-2.7, 0, 5.35);
      worker.rotation.y = Math.PI;
    } else if (step === 4) {
      stationCoords = [-0.9, 1.10, 3.8];
      worker.position.set(-0.9, 0, 5.35);
      worker.rotation.y = Math.PI;
    } else if (step === 5) {
      stationCoords = [1.25, 1.10, 3.7];
      worker.position.set(0.8, 0, 5.35);
      worker.rotation.y = Math.PI;
    } else if (step === 6) {
      stationCoords = [0.8, 1.30, 4.8];
      worker.position.set(0.8, 0, 5.35);
      worker.rotation.y = Math.PI;
    }

    // Kinematics Fix: Lerp in world space and convert cleanly to pouches local space
    pouches.updateMatrixWorld(true);
    let homeWorld = basePositions[index].clone().applyMatrix4(pouches.matrixWorld);
    let stationWorld = new THREE.Vector3(...stationCoords);
    let currentWorld = homeWorld.clone().lerp(stationWorld, Math.sin(f * Math.PI));
    p.g.position.copy(pouches.worldToLocal(currentWorld));

    if (worker.carry) worker.carry.visible = false;

    if (step === 3) {
      packs.forEach((p, i) => {
        let isDone = i < index;
        let isCurrent = i === index;
        let fillProg = isCurrent ? clamp((f - 0.2) / 0.5) : 0;
        let sy = isDone ? 1.0 : isCurrent ? 0.18 + 0.82 * fillProg : 0.18;
        let sz = isDone ? 1.0 : isCurrent ? 0.45 + 0.55 * fillProg : 0.45;
        p.body.scale.set(1.0, sy, sz);
        p.body.position.set(0, 0, 0);
        p.seam.position.set(0, 0.210 * 0.88 * sy, 0);
        p.label.position.set(0, 0.210 * 0.42 * sy, (0.095 * 0.52 * sz) + 0.002);
        p.label.scale.set(1.0, sy, sz);
      });
      scoop.visible = true;
      let sT = clamp(f / 0.45);
      let sPos = lerp3([-2.1, 1.15, 4.4], [-3.2, 1.15, 4.0], sT);
      sPos.y += Math.sin(sT * Math.PI) * 0.12;
      scoop.position.copy(sPos);
      if (armPivots.length === 2) {
        armPivots[0].rotation.x = -0.55 + Math.sin(f * Math.PI) * 0.12;
        armPivots[1].rotation.x = -0.65 + Math.sin(f * Math.PI) * 0.25;
      }
      caption = `Weigh pouch ${index + 1} / 20 · scoop 150 g of roasted cashews into the pouch.`;
    }

    if (step === 4) {
      if (jaw) jaw.rotation.x = -0.6 * (1 - Math.sin(f * Math.PI));
      p.seam.visible = f > 0.55;
      if (armPivots.length === 2) {
        armPivots[0].rotation.x = -0.55;
        armPivots[1].rotation.x = -0.65 - 0.25 * Math.sin(f * Math.PI);
      }
      caption = `Seal pouch ${index + 1} / 20 · the sealing jaw closes to create a food-grade hermetic bond.`;
    }

    if (step === 5) {
      p.label.visible = f > 0.45;
      if (armPivots.length === 2) {
        armPivots[0].rotation.x = -0.55;
        armPivots[1].rotation.x = -0.65 + Math.sin(f * Math.PI) * 0.15;
      }
      caption = `Apply label ${index + 1} / 20 · sealed pouches receive their regulatory product label.`;
    }

    if (step === 6) {
      p.g.rotation.y = Math.sin(f * Math.PI * 2) * 0.6;
      if (armPivots.length === 2) {
        armPivots[0].rotation.x = -0.75;
        armPivots[1].rotation.x = -0.75;
      }
      caption = `Inspect pouch ${index + 1} / 20 · examine seal integrity and verify net weight compliance.`;
    }
  }

  if (step === 7) {
    worker.position.set(2.0, 0, 5.35);
    worker.rotation.y = Math.PI;
    if (worker.carry) worker.carry.visible = false;
    if (armPivots.length === 2) {
      armPivots[0].rotation.x = -0.55 + Math.sin(f * Math.PI) * 0.12;
      armPivots[1].rotation.x = -0.65 + Math.sin(f * Math.PI) * 0.15;
    }

    pouches.updateMatrixWorld(true);
    packs.forEach((p, i) => {
      let k = clamp(u - i);
      let homeWorld = basePositions[i].clone().applyMatrix4(pouches.matrixWorld);
      let col = (i % 4) - 1.5;
      let row = Math.floor(i / 4) - 2.0;
      let endWorld = new THREE.Vector3(2.0 + col * 0.15, 1.06, 4.0 + row * 0.09);
      let currentPos = homeWorld.clone().lerp(endWorld, k);
      if (k > 0 && k < 1) {
        currentPos.y += Math.sin(k * Math.PI) * 0.40;
      }
      p.g.position.copy(pouches.worldToLocal(currentPos));
      p.g.visible = t <= 0.85;
    });
    closedBox.visible = t > 0.85;
    openBox.visible = t <= 0.85;
    if (closedBox.visible) {
      closedBox.position.set(2.0, 1.03, 4.0);
    }
    caption = 'Pack all 20 inspected pouches into one shipping carton, then close and tape the box.';
  }

  if (step === 8) {
    let travel = clamp(t / 0.85);
    let pos = pathPoint(waypoints, travel);
    worker.position.set(pos.x, 0, pos.z);

    let walkPhase = travel * 32;
    if (travel < 0.88) {
      // Walking along aisle facing travel direction (+X)
      worker.rotation.y = Math.PI / 2;
      if (legs.length === 2) {
        legs[0].rotation.x = Math.sin(walkPhase) * 0.45;
        legs[1].rotation.x = -Math.sin(walkPhase) * 0.45;
      }
      if (armPivots.length === 2) {
        armPivots[0].rotation.x = -0.7;
        armPivots[1].rotation.x = -0.7;
      }
      if (worker.carry) worker.carry.visible = true;
      closedBox.visible = false;
      caption = 'Carry the carton along the transit crosswalk to the finished-goods storage area.';
    } else {
      // Arrived at landing table [11.0, 0, 5.2], turns to face table at z=4.0
      worker.rotation.y = Math.PI;
      if (legs.length === 2) {
        legs[0].rotation.x = 0;
        legs[1].rotation.x = 0;
      }
      if (armPivots.length === 2) {
        armPivots[0].rotation.x = -0.2;
        armPivots[1].rotation.x = -0.2;
      }
      if (worker.carry) worker.carry.visible = false;
      closedBox.visible = true;
      closedBox.position.set(11.0, 1.07, 4.0);
      caption = 'Place the completed carton on the storage staging table.';
    }
  }

  if (step === 9) {
    if (t <= 0.45) {
      // Walking back from storage to bench facing -X
      let returnT = clamp(t / 0.45);
      let returnPts = [[11.0, 0, 5.2], [6.4, 0, 5.35], [2.0, 0, 5.35]];
      let pos = pathPoint(returnPts, returnT);
      worker.position.set(pos.x, 0, pos.z);
      worker.rotation.y = -Math.PI / 2;

      let walkPhase = returnT * 24;
      if (legs.length === 2) {
        legs[0].rotation.x = Math.sin(walkPhase) * 0.45;
        legs[1].rotation.x = -Math.sin(walkPhase) * 0.45;
      }
      if (armPivots.length === 2) {
        armPivots[0].rotation.x = -Math.sin(walkPhase) * 0.45;
        armPivots[1].rotation.x = Math.sin(walkPhase) * 0.45;
      }
      if (worker.carry) worker.carry.visible = false;
      closedBox.visible = true;
      closedBox.position.set(11.0, 1.07, 4.0);
      wipe.visible = false;
      caption = 'Return along the walkway to the packaging workstation and prepare for the next carton.';
    } else {
      // Worker returns to bench, turns to face bench (rotation.y = Math.PI) and cleans table
      let cleanT = (t - 0.45) / 0.55;
      let cleanX = 2.0 - cleanT * 5.5;
      worker.position.set(cleanX, 0, 5.35);
      worker.rotation.y = Math.PI;

      if (legs.length === 2) {
        legs[0].rotation.x = 0;
        legs[1].rotation.x = 0;
      }
      wipe.visible = true;
      wipe.position.set(cleanX - 0.2 + Math.sin(cleanT * 30) * 0.35, 1.04, 4.35 + Math.cos(cleanT * 30) * 0.15);

      if (armPivots.length === 2) {
        armPivots[0].rotation.x = -0.3;
        armPivots[1].rotation.x = -0.65 + Math.sin(cleanT * 30) * 0.15;
      }
      if (worker.carry) worker.carry.visible = false;
      closedBox.visible = true;
      closedBox.position.set(11.0, 1.07, 4.0);
      caption = 'Clean and sanitize the stainless steel bench top. Clean Table is the final measured step.';
    }
  }

  // Idle posture resets when not walking or operating
  if (step < 8 || (step === 9 && t > 0.45)) {
    if (legs.length === 2) {
      legs[0].rotation.x = 0;
      legs[1].rotation.x = 0;
    }
  }
  if (step <= 1) {
    if (armPivots.length === 2) {
      armPivots[0].rotation.x = 0;
      armPivots[1].rotation.x = 0;
    }
  }

  ring.position.set(worker.position.x, 0.09, worker.position.z);
  ring.visible = step >= 2;

  if (caption !== lastCaption) {
    progress.textContent = caption;
    lastCaption = caption;
  }
}

// 8. Main Render Loop
function animationFrame(now) {
  requestAnimationFrame(animationFrame);
  let delta = lastFrame === null ? 0 : Math.min(100, now - lastFrame);
  lastFrame = now;

  const speed = window.simSpeed || 1.0;
  if (!motionPaused) {
    motionTime += delta * speed;
    if (motionTime >= 12000) {
      if (playing) {
        // Step action completed! Advance to next step immediately:
        motionTime = 0;
        let nextStep = step === 9 ? 0 : step + 1;
        setStep(nextStep, true);
      } else {
        // In manual single-step mode, loop the current step action:
        motionTime = motionTime % 12000;
      }
    }
    renderMotion(motionTime);
  }

  if (env.cameraController && env.cameraController.update) {
    env.cameraController.update(now);
  }

  renderer.render(scene, camera);
  window.factoryState.rendered = true;
}

requestAnimationFrame(animationFrame);

// 9. Global APIs for Testing & Automation
window.animationAPI = {
  seek: (s, ms) => {
    setStep(s, true);
    motionPaused = true;
    motionTime = ms;
    renderMotion(ms);
  },
  renderMotion,
  waypoints,
  packs
};

window.factoryAPI = {
  view: (v, smooth = true) => view(v, smooth),
  setStep,
  play: () => $('play').click()
};

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  const isTextInput = activeTag === 'TEXTAREA' || (activeTag === 'INPUT' && document.activeElement.type !== 'range') || activeTag === 'SELECT';
  if (isTextInput) return;

  // Navigation steps: Left / Right arrow (active in all modes including walk mode)
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    setStep(step === 9 ? 0 : step + 1, true);
    return;
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    setStep(Math.max(0, step - 1), true);
    return;
  }

  // Tour toggle: T key
  if (e.key.toLowerCase() === 't') {
    e.preventDefault();
    if ($('play')) $('play').click();
    return;
  }

  // Stop motion / Pause motion: Space key
  if (e.key === ' ') {
    e.preventDefault();
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    if (motionButton) {
      motionButton.click();
    } else {
      motionPaused = !motionPaused;
      if (typeof updateMotionButton === 'function') updateMotionButton();
    }
    return;
  }

  // Pure simulation / Fullscreen (disable UI): R key
  if (e.key.toLowerCase() === 'r') {
    e.preventDefault();
    if (typeof window.togglePureSimulation === 'function') {
      window.togglePureSimulation();
    } else if (typeof window.toggleFullscreen === 'function') {
      window.toggleFullscreen();
    }
    return;
  }

  // Study drawer toggle: Tab key
  if (e.key === 'Tab') {
    e.preventDefault();
    if (typeof window.toggleDrawer === 'function') window.toggleDrawer();
    return;
  }

  // Escape key: Restore UI from pure view or close drawer
  if (e.key === 'Escape') {
    if (document.body.classList.contains('pure-view')) {
      e.preventDefault();
      if (typeof window.togglePureSimulation === 'function') window.togglePureSimulation(false);
      return;
    }
    const drawer = document.getElementById('studyDrawer');
    if (drawer && drawer.classList.contains('open')) {
      e.preventDefault();
      if (typeof window.toggleDrawer === 'function') window.toggleDrawer(false);
      return;
    }
  }

  // Cycle camera views: V key
  if (e.key.toLowerCase() === 'v') {
    e.preventDefault();
    let views = ['overview', 'bench', 'top'];
    let cur = views.findIndex((id) => $(id) && $(id).classList.contains('on'));
    view(views[(cur + 1) % views.length]);
    return;
  }
});

// Initial state trigger
resize();
update();
