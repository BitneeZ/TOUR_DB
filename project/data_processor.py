import json
import pandas as pd

def process_dataset(file_path):
    # Load dataset using pandas
    df = pd.read_csv(file_path)

    # Ensure required columns exist
    required_columns = {"labels", "values", "categories"}
    if not required_columns.issubset(df.columns):
        raise ValueError(f"Dataset must contain the following columns: {required_columns}")

    # Extract data for processing
    labels = df["labels"].tolist()
    values = df["values"]
    categories = df["categories"]

    # Calculate overall statistics
    overall_stats = {
        "mean": values.mean(),
        "median": values.median(),
        "std": values.std(),
        "min": values.min(),
        "max": values.max()
    }

    # Calculate category-wise statistics
    category_means = values.groupby(categories).mean().to_dict()

    # Prepare data for output
    data = {
        "labels": labels,
        "values": values.tolist(),
        "categories": categories.tolist(),
        "statistics": {
            **overall_stats,
            "category_means": {str(k): float(v) for k, v in category_means.items()}
        }
    }

    # Save to JSON file that will be read by the dashboard
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    # Replace 'your_dataset.csv' with the path to your CSV file
    process_dataset("TOUR_DB/tourism_dataset.csv")
