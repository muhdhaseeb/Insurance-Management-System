import Policy from "../models/Policy.js";

export const getRecommendations = async (req, res) => {
    // Inputs from PolicyWizard: age, income, dependents, riskTolerance
    const { age, occupation, travelFrequency, dependents, smoker, budget, coverageType, income, riskTolerance } = req.body;

    // Derived values
    const safeBudget = budget || (income ? income / 12 * 0.1 : 100); // 10% of monthly income
    const safeAge = parseInt(age) || 30;
    const safeDependents = parseInt(dependents) || 0;

    let recommendations = [
        {
            id: "travel-plus",
            title: "Global Travel Protection",
            description: "Comprehensive coverage for lost luggage, flight delays, and medical emergencies abroad.",
            matchScore: (travelFrequency === "frequent" ? 50 : 20) + (riskTolerance === "High" ? 30 : 10),
            premium: 45,
            type: "TRAVEL"
        },
        {
            id: "life-secure",
            title: "Family Life Secure",
            description: "High-value life coverage with significant payout for dependents. Essential for family security.",
            matchScore: (safeDependents > 0 ? 50 : 10) + (safeAge > 30 ? 20 : 10) + (riskTolerance === "Low" ? 20 : 0),
            premium: 120,
            type: "LIFE"
        },
        {
            id: "health-pro",
            title: "Health Pro Max",
            description: "Complete health coverage including dental, vision, and preventive care.",
            matchScore: (safeAge > 40 ? 40 : 20) + (riskTolerance === "Low" ? 30 : 10) + (safeDependents > 0 ? 20 : 0),
            premium: 180,
            type: "HEALTH"
        },
        {
            id: "wealth-builder",
            title: "Wealth Builder Unit Link",
            description: "Investment-linked insurance product designed for growth and protection.",
            matchScore: (safeBudget > 200 ? 50 : 10) + (riskTolerance === "High" ? 50 : 0) + (safeAge < 45 ? 20 : 0),
            premium: 250,
            type: "INVESTMENT"
        }
    ];

    // Penalty for budget (if premium exceeds budget, reduce score significantly)
    recommendations = recommendations.map(rec => {
        let score = rec.matchScore;
        if (rec.premium > safeBudget) score -= 40;

        // Ensure valid number
        if (isNaN(score)) score = 0;

        return {
            name: rec.title,
            description: rec.description,
            premium: rec.premium,
            type: rec.type,
            matchScore: Math.max(0, Math.min(score, 100))
        };
    });

    // Sort by match score
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, data: recommendations });
};

export const getAllPolicies = async (req, res) => {
    // In a real app, this might come from a DB of templates
    // Using static data for stability
    const templates = [
        { name: "Global Travel Protection", type: "TRAVEL", premium: 45, coverageAmount: 50000 },
        { name: "Family Life Secure", type: "LIFE", premium: 120, coverageAmount: 500000 },
        { name: "Health Pro Max", type: "HEALTH", premium: 180, coverageAmount: 100000 },
        { name: "Wealth Builder Unit Link", type: "INVESTMENT", premium: 250, coverageAmount: 20000 },
    ];
    res.json({ success: true, data: templates });
};
